import ModelPlayer from '../../model/model/ModelPlayer.js'
import EntityRenderer from '../EntityRenderer.js'
import Block from '../../../world/block/Block.js'
import * as THREE from '../../../../../../../../libraries/three.module.js'
import { ToolRegistry } from '../../../world/tool/ToolRegistry.js'

const loader = new THREE.ObjectLoader()

export default class PlayerRenderer extends EntityRenderer {
  constructor(worldRenderer) {
    super(new ModelPlayer())

    this.worldRenderer = worldRenderer

    // Load character texture
    this.textureCharacter = worldRenderer.minecraft.getThreeTexture('char.png')
    this.textureCharacter.magFilter = THREE.NearestFilter
    this.textureCharacter.minFilter = THREE.NearestFilter

    // First person right-hand holder
    this.handModel = null
    this.firstPersonGroup = new THREE.Object3D()
    this.worldRenderer.overlay.add(this.firstPersonGroup)

    // Tool loader
    /**
     * @type {Record<string, THREE.Object3D>}
     */
    this.models = {}
    ToolRegistry.create()
    Object.entries(ToolRegistry.tools).forEach(([id, tool]) => {
      loader.load(tool.url, model => {
        this.models[id] = model
      })
    })
  }

  rebuild(entity) {
    let isSelf = entity === this.worldRenderer.minecraft.player
    let firstPerson = this.worldRenderer.minecraft.settings.thirdPersonView === 0
    let itemId = firstPerson && isSelf ? this.worldRenderer.itemToRender : entity.inventory.getItemInSelectedSlot()
    let hasItem = itemId !== 0

    if (firstPerson && hasItem && isSelf) {
      super.rebuild(entity)

      // Create new item group and add it to the hand
      this.firstPersonGroup.clear()
      let itemGroup = new THREE.Object3D()
      this.firstPersonGroup.add(itemGroup)

      // Render item in hand in first person
      let block = Block.getById(itemId)
      if (block.tool) {
        if (itemId === -1) {
          let mesh = new THREE.Mesh()
          mesh.add(this.models.IRON_PICKAXE)
          mesh.scale.set(16, 16, 16)
          mesh.rotation.z = Math.PI / 2
          mesh.rotation.y = Math.PI / 2 + 1
          itemGroup.add(mesh)
          mesh.geometry.center()
        }
      } else {
        this.worldRenderer.blockRenderer.renderBlockInFirstPerson(itemGroup, block, entity.getEntityBrightness())
      }
      // Copy material and update depth test of the item to render it always in front
      let mesh = itemGroup.children[0]
      mesh.material = mesh.material.clone()
      mesh.material.depthTest = false
    } else {
      this.tessellator.bindTexture(this.textureCharacter)
      super.rebuild(entity)

      // Render item in hand in third person
      if (hasItem) {
        let block = Block.getById(itemId)
        let group = this.model.rightArm.bone
        this.worldRenderer.blockRenderer.renderBlockInHandThirdPerson(group, block, entity.getEntityBrightness())
      }

      // Create first person right hand and attach it to the holder
      this.firstPersonGroup.clear()
      this.handModel = this.model.rightArm.clone()
      this.firstPersonGroup.add(this.handModel.bone)

      // Copy material and update depth test of the hand to render it always in front
      let mesh = this.handModel.bone.children[0]
      mesh.material = mesh.material.clone()
      mesh.material.depthTest = false
    }
  }

  render(entity, partialTicks) {
    let swingProgress = entity.swingProgress - entity.prevSwingProgress
    if (swingProgress < 0.0) {
      swingProgress++
    }
    this.model.swingProgress = entity.prevSwingProgress + swingProgress * partialTicks
    this.model.hasItemInHand = entity.inventory.getItemInSelectedSlot() !== 0
    this.model.isSneaking = entity.isSneaking()

    // TODO find a better way
    if (entity !== this.worldRenderer.minecraft.player) {
      this.firstPersonGroup.visible = false
    }

    super.render(entity, partialTicks)
  }

  updateFirstPerson(player) {
    // Make sure the model is created
    this.prepareModel(player)

    // Make the group visible
    this.firstPersonGroup.visible = true
  }

  renderRightHand(player, partialTicks) {
    this.updateFirstPerson(player)

    // Set transform of renderer
    this.model.swingProgress = 0
    this.model.hasItemInHand = false
    this.model.isSneaking = false
    this.model.setRotationAngles(player, 0, 0, 0, 0, 0, 0)
    this.handModel.copyTransformOf(this.model.rightArm)

    // Render hand model
    this.handModel.render()
  }

  fillMeta(entity, meta) {
    super.fillMeta(entity, meta)

    let firstPerson = this.worldRenderer.minecraft.settings.thirdPersonView === 0

    meta.firstPerson = firstPerson
    meta.itemInHand = firstPerson ? this.worldRenderer.itemToRender : entity.inventory.getItemInSelectedSlot()
  }
}
