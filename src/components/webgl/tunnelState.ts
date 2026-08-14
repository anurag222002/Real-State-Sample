/** Bridge between DOM scroll choreography and the WebGL tunnel. */
export const tunnelState = {
  /** 0 → 1 progress of the hero dive. */
  dive: 0,
  /** Signed scroll velocity, used to stretch the tunnel on fast flicks. */
  velocity: 0,
  /** Normalised pointer position, -1 → 1. */
  pointerX: 0,
  pointerY: 0,
};
