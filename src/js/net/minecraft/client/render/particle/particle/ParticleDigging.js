import Particle from '../Particle.js'

export default class ParticleDigging extends Particle {
  constructor(minecraft, world, x, y, z, motionX, motionY, motionZ, block) {
    super(minecraft, world, x, y, z, motionX, motionY, motionZ)

    // Get color multiplier
    let color = block.getParticleColor(world, x, y, z)
    let red = (color >> 16) & 0xff
    let green = (color >> 8) & 0xff
    let blue = color & 0xff

    red *= 0.6
    green *= 0.6
    blue *= 0.6

    this.color = (red << 16) | (green << 8) | blue

    this.textureIndex = block.getTextureForFace(block.getParticleTextureFace())
  }
}
