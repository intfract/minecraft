import Tool from '../Tool'

export default class Pickaxe extends Tool {
  constructor(material) {
    super(material)

    this.efficiency = Tool.materials.indexOf(material) * 2
    this.url = `objects/pickaxe/${material}.json`
  }
}
