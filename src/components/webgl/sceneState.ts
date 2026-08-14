/** Bridge between DOM scroll choreography and the WebGL skyline. */
export const sceneState = {
  /** 0 → 1 progress of the hero fly-through. */
  dive: 0,
  /** Signed scroll velocity, used to surge the fly-through on fast flicks. */
  velocity: 0,
  /** Normalised pointer position, -1 → 1. */
  pointerX: 0,
  pointerY: 0,
};
