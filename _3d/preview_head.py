# Превью GLB бюста: спереди и в три четверти, Workbench. blender -b --factory-startup -P preview_head.py -- in.glb out_prefix [yaw_deg]
import bpy, sys, math
a = sys.argv[sys.argv.index("--") + 1:]
src, pre = a[0], a[1]; yaw = float(a[2]) if len(a) > 2 else 0
for o in list(bpy.data.objects): bpy.data.objects.remove(o)
bpy.ops.import_scene.gltf(filepath=src)
rig = next(o for o in bpy.data.objects if o.type == "ARMATURE")
if yaw:
    pb = rig.pose.bones["head"]; pb.rotation_mode = "XYZ"; pb.rotation_euler = (0, math.radians(yaw * .6), 0)
    pn = rig.pose.bones["neck_01"]; pn.rotation_mode = "XYZ"; pn.rotation_euler = (0, math.radians(yaw * .4), 0)
sc = bpy.context.scene; sc.render.engine = "BLENDER_WORKBENCH"
sc.display.shading.light = "MATCAP"; sc.display.shading.studio_light = "metal_carpaint.exr"
sc.render.resolution_x, sc.render.resolution_y = 800, 900
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); sc.collection.objects.link(cam); sc.camera = cam
cam.data.lens = 85
for name, ang in (("front", 0), ("q", 35)):
    r = 2.2; t = math.radians(ang)
    cam.location = (r * math.sin(t), -r * math.cos(t), 1.5)
    cam.rotation_euler = (math.radians(90), 0, t)
    sc.render.filepath = f"{pre}-{name}.png"; bpy.ops.render.render(write_still=True)
