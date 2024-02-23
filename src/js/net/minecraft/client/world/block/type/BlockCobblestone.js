import Pickaxe from '../../tool/type/Pickaxe.js'
import Block from '../Block.js'

export default class BlockCobblestone extends Block {
  constructor(id, textureSlotId) {
    super(id, textureSlotId)

    this.hardness = 16
    this.correctTool = Pickaxe
  }
}
