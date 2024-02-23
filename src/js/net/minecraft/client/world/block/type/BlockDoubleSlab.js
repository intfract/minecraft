import Block from '../Block.js'
import EnumBlockFace from '../../../../util/EnumBlockFace.js'
import Pickaxe from '../../tool/type/Pickaxe.js'

export default class BlockDoubleSlab extends Block {
  constructor(id, textureSlotId) {
    super(id, textureSlotId)

    this.correctTool = Pickaxe
  }

  getTextureForFace(face) {
    switch (face) {
      case EnumBlockFace.TOP:
        return this.textureSlotId - 1
      case EnumBlockFace.BOTTOM:
        return this.textureSlotId - 1
      default:
        return this.textureSlotId
    }
  }
}
