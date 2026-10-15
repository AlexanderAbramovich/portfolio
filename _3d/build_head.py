# Хромовый бюст для главной: человек MPFB (CC0) по грудь, руки вдоль тела, скелет game_engine.
# Голова на сайте поворачивается костями neck_01 и head, плечи стоят.
# Запуск: blender -b --factory-startup -P build_head.py -- <out.glb>
import bpy, addon_utils, sys, bmesh
from mathutils import Vector, Matrix

OUT = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "head.glb"
CUT_Z = 0.98          # всё ниже — за нижним краем героя, не экспортируем
FRAME_H = .47        # кадр «макушка → линия груди», м: на сайте линия груди встаёт на нижний край героя

addon_utils.enable("bl_ext.blender_org.mpfb", default_set=True)
from bl_ext.blender_org.mpfb.services.humanservice import HumanService
from bl_ext.blender_org.mpfb.services.targetservice import TargetService

for o in list(bpy.data.objects): bpy.data.objects.remove(o)
macro = TargetService.get_default_macro_info_dict()
# 15.10: muscle .7 / proportions 1 дали «Ван Дамма» — тело суше и уже, обычный стройный парень
macro.update(gender=1.0, age=0.45, muscle=0.5, weight=0.35, proportions=0.6)
macro["race"] = {"asian": 0.2, "caucasian": 0.6, "african": 0.2}
body = HumanService.create_human(macro_detail_dict=macro)
# точечные правки до рига, чтобы кости встали по новой форме
SHAPE = {"measure-shoulder-dist-decr": .6, "torso-muscle-pectoral-decr": .5, "torso-muscle-dorsi-decr": .5,
         "torso-scale-horiz-decr": .3, "measure-neck-circ-decr": .3, "neck-double-decr": .8}
for name, w in SHAPE.items():
    TargetService.load_target(body, TargetService.target_full_path(name), weight=w)
rig = HumanService.add_builtin_rig(body, "game_engine")
TargetService.bake_targets(body)

def activate(o, mode="OBJECT"):
    if bpy.context.object and bpy.context.object.mode != "OBJECT": bpy.ops.object.mode_set(mode="OBJECT")
    for x in bpy.context.view_layer.objects: x.select_set(False)
    o.select_set(True); bpy.context.view_layer.objects.active = o
    if mode != "OBJECT": bpy.ops.object.mode_set(mode=mode)

# --- поза: руки вдоль тела, локоть почти прямой ---
activate(rig, "POSE")
def aim(name, target):
    pb = rig.pose.bones[name]
    bpy.context.view_layer.update()
    d = (pb.tail - pb.head).normalized()
    q = d.rotation_difference(Vector(target).normalized())
    m = pb.matrix.copy(); head = m.to_translation()
    pb.matrix = Matrix.Translation(head) @ q.to_matrix().to_4x4() @ Matrix.Translation(-head) @ m
    bpy.context.view_layer.update()
for s in (1, -1):
    side = "l" if s > 0 else "r"
    aim(f"upperarm_{side}", (s * .2, .03, -1))
    aim(f"lowerarm_{side}", (s * .1, -.12, -1))
    aim(f"hand_{side}", (s * .06, -.05, -1))

# запекаем позу в меш и делаем её позой покоя
activate(body)
arm_mod = next(m for m in body.modifiers if m.type == "ARMATURE")
bpy.ops.object.modifier_apply(modifier=arm_mod.name)
activate(rig, "POSE"); bpy.ops.pose.armature_apply(selected=False); bpy.ops.object.mode_set(mode="OBJECT")

# --- оставляем тело и глаза, остальные помощники убираем ---
activate(body)
keep = body.vertex_groups.new(name="keep")
gi = {g.name: g.index for g in body.vertex_groups}
want = {gi["body"], gi["helper-l-eye"], gi["helper-r-eye"]}
eye_ids = {gi["helper-l-eye"], gi["helper-r-eye"]}
eyes = []
for v in body.data.vertices:
    gs = {g.group for g in v.groups if g.weight > .5}
    if gs & want: keep.add([v.index], 1.0, "REPLACE")
    if gs & eye_ids: eyes.append(v.index)
mask = next(m for m in body.modifiers if m.type == "MASK")
mask.vertex_group = "keep"
bpy.ops.object.modifier_apply(modifier=mask.name)

# глаза: если у помощников нет веса на кости, вешаем их на голову
head_g = body.vertex_groups["head"]
deform = {b.name for b in rig.data.bones}
for v in body.data.vertices:
    if any(body.vertex_groups[g.group].name == "helper-l-eye" or body.vertex_groups[g.group].name == "helper-r-eye" for g in v.groups):
        if not any(body.vertex_groups[g.group].name in deform and g.weight > 0 for g in v.groups):
            head_g.add([v.index], 1.0, "REPLACE")

# --- обрез ниже кадра ---
bm = bmesh.new(); bm.from_mesh(body.data)
bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < CUT_Z], context="VERTS")
bm.to_mesh(body.data); bm.free()

# --- лишние группы вон, гладкость, подразделение (веса интерполируются) ---
for g in list(body.vertex_groups):
    if g.name not in deform: body.vertex_groups.remove(g)
for p in body.data.polygons: p.use_smooth = True
sub = body.modifiers.new("Sub", "SUBSURF"); sub.levels = sub.render_levels = 1
bpy.ops.object.modifier_apply(modifier=sub.name)
am = body.modifiers.new("Armature", "ARMATURE"); am.object = rig
body.parent = rig

# кадр для сайта: верх макушки и линия груди, точки в метрах (Z вверх)
top = max(v.co.z for v in body.data.vertices)
rig["frame_top"] = top; rig["frame_bottom"] = top - FRAME_H
mat = bpy.data.materials.new("chrome"); body.data.materials.clear(); body.data.materials.append(mat)
print("STATS verts", len(body.data.vertices), "tris", sum(len(p.vertices) - 2 for p in body.data.polygons), "top", round(top, 3), "eyes", len(eyes))

for x in bpy.context.view_layer.objects: x.select_set(False)
body.select_set(True); rig.select_set(True); bpy.context.view_layer.objects.active = rig
bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", use_selection=True, export_skins=True, export_animations=False,
                          export_morph=False, export_extras=True, export_yup=True, export_apply=False, export_materials="EXPORT",
                          export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=7)
print("EXPORTED", OUT)
