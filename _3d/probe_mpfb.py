# Разведка MPFB: какие группы вершин и кости есть у базового человека с ригом game_engine.
import bpy, addon_utils
addon_utils.enable("bl_ext.blender_org.mpfb", default_set=True)
from bl_ext.blender_org.mpfb.services.humanservice import HumanService
from bl_ext.blender_org.mpfb.services.targetservice import TargetService

for o in list(bpy.data.objects): bpy.data.objects.remove(o)
macro = TargetService.get_default_macro_info_dict()
macro.update(gender=1.0, age=0.5, muscle=0.7, weight=0.45, proportions=1.0)
macro["race"] = {"asian": 0.2, "caucasian": 0.6, "african": 0.2}
body = HumanService.create_human(macro_detail_dict=macro)
rig = HumanService.add_builtin_rig(body, "game_engine")
print("VERTS", len(body.data.vertices), "DIMS", tuple(round(v, 3) for v in body.dimensions))
print("GROUPS", [g.name for g in body.vertex_groups if not g.name.startswith("joint-")][:200])
print("BONES", [(b.name, b.parent.name if b.parent else None, tuple(round(v, 3) for v in b.head_local)) for b in rig.data.bones])
print("MODS", [(m.name, m.type) for m in body.modifiers])
print("SHAPEKEYS", [k.name for k in body.data.shape_keys.key_blocks] if body.data.shape_keys else None)
