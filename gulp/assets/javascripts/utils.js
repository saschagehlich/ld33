import Vector2 from './math/vector2'

export default {
  directionToVector (direction) {
    let vector = new Vector2(0, 0)
    switch (direction) {
      case 0:
        vector.y = -1
        break
      case 1:
        vector.x = 1
        break
      case 2:
        vector.y = 1
        break
      case 3:
        vector.x = -1
        break
    }
    return vector
  }
}
