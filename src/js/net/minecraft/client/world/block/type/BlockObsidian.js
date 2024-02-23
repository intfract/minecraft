import Pickaxe from '../../tool/type/Pickaxe.js'
import Block from '../Block.js'

export default class BlockObsidian extends Block {
  constructor(id, textureSlotId) {
    super(id, textureSlotId)

    this.hardness = 32
    this.correctTool = Pickaxe
  }
}
