import bpy
import json

OBJNAME = "Cube"

bones = []

armature = bpy.data.objects["Armature"]

for bone in armature.data.bones:
    bones.append({
        "name": bone.name,
        "parent": bone.parent.name if bone.parent else None,
        "head": list(bone.head_local),
        "tail": list(bone.tail_local)
    })
    
    
mesh_obj = bpy.data.objects[OBJNAME] # <-- Object name

weights = []

for vertex in mesh_obj.data.vertices:

    vw = {
        "vertex": vertex.index,
        "weights": []
    }

    for group in vertex.groups:

        bone_name = mesh_obj.vertex_groups[group.group].name

        vw["weights"].append({
            "bone": bone_name,
            "weight": group.weight
        })

    weights.append(vw)

for action in bpy.data.actions:
    print(action)
    print(type(action))
    
animations = []

for action in bpy.data.actions:
    
    anim = {
        "name": action.name,
        "keyframes": []
    }

    start, end = map(int, action.frame_range)

    armature.animation_data.action = action

    for frame in range(start, end + 1):

        bpy.context.scene.frame_set(frame)
        
        frame_data = {
            "frame": frame,
            "bones": []
        }

        for bone in armature.pose.bones:
            
            frame_data["bones"].append({
                "name": bone.name,
                "location": list(bone.location),
                "rotation": list(bone.rotation_quaternion)
            })
            
        anim["keyframes"].append(frame_data)
    
    animations.append(anim)
            
            
data = {
    "bones": bones,
    "weights": weights,
    "animations": animations
}

with open("C:/Users/Victor/Documents/PROJETOS_V/anim.json", "w") as f:
    json.dump(data, f, indent=4)

print("Animations", animations)           
print("Bones", bones)
print("weights", weights)