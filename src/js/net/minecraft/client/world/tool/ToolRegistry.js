import Pickaxe from './type/Pickaxe'

export class ToolRegistry {
  /**
   * @type {Record<string, Tool>}
   */
  static tools = {}
  static create() {
    ToolRegistry.tools.IRON_PICKAXE = new Pickaxe('iron')
  }
}