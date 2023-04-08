import { max, min, int, float, toInt } from "@/simulation/polyfill";

export class BeltLaneDefinition {
  public static STEPS_PER_UNIT: int = 5n;
  public static TICKS_PER_SECOND: int = 10n;

  public static SPACING_S: int = this.STEPS_PER_UNIT / 2n;
  public static SPACING_HALF_S: int = this.SPACING_S / 2n;

  ////////////////////////////////////////////////////////////////

  public Name = "";
  public Duration: float = 0.5;
  public Length_W: float = 0.5;
  public Length_S: int = 0n;
  public Duration_T: int = 0n;
  public StepsPerTick_S: int = 0n;

  public ComputeMetrics(): void {
    let length_S = this.Length_W * Number(BeltLaneDefinition.STEPS_PER_UNIT);
    if (length_S % 1.0 != 0.0) {
      console.error(
        "Invalid belt lane world width: " + this.Length_W + " -> Causes bad step count: " + length_S,
      );
    }
    this.Length_S = toInt(length_S);

    let duration_T = this.Duration * Number(BeltLaneDefinition.TICKS_PER_SECOND);
    if (duration_T % 1.0 != 0.0) {
      console.error(
        "Invalid belt lane duration: " + this.Duration + " -> Causes bad tick count: " + duration_T,
      );
    }

    this.Duration_T = toInt(duration_T);

    if (this.Length_S == 0n) {
      this.StepsPerTick_S = 0n;
    } else {
      let stepsPerTick_S = Number(this.Length_S) / Number(this.Duration_T);
      if (stepsPerTick_S % 1.0 != 0.0) {
        console.warn(
          "Invalid belt lane duration on " +
            this.Name +
            " and length combination: " +
            this.Length_W +
            " length / " +
            this.Duration +
            " seconds -> " +
            this.Length_S +
            " / " +
            this.Duration_T +
            " -> Causes bad tick count: " +
            stepsPerTick_S,
        );
      }
      this.StepsPerTick_S = toInt(stepsPerTick_S);
    }

    // Debug.Log(
    //     "Lane "
    //         + Name
    //         + ": Length="
    //         + Length_S
    //         + " Ticks="
    //         + Duration_T
    //         + " Steps/Tick="
    //         + StepsPerTick_S
    // );
  }

  public get ScaledDuration(): float {
    return this.Duration;
  }

  public StepsToTicks_T(steps: int): int {
    if (this.Length_W == 0) {
      // Special handling for zero lanes
      return steps >= 0n ? this.Duration_T : -1n;
    }

    if (steps < 0) {
      return -1n;
    } else if (steps >= this.Length_S) {
      return this.Duration_T;
    }

    // if (steps % StepsPerTick_S != 0)
    // {
    // Debug.LogWarning(
    //     "Bad conversion from "
    //         + steps
    //         + " steps to ticks, steps/tick="
    //         + StepsPerTick_S
    //         + " on "
    //         + this
    // );
    // }

    return steps / this.StepsPerTick_S;
  }

  public TicksToSteps_S(ticks: int): int {
    return ticks * this.StepsPerTick_S;
  }

  // public float3 GetPosFromTicks_L(int ticks)
  // {
  //     if (ticks < 0 || ticks >= Duration_T)
  //     {
  //         // #if UNITY_EDITOR
  //         throw new Exception("Invalid progress value on " + this + ": " + ticks);
  //         // #endif
  //     }
  //     return math.lerp(ItemStartPos_L, ItemEndPos_L, TicksToProgress_UNSAFE(ticks));
  // }

  public static StepsToWorld_UNSAFE(steps: int): float {
    return Number(steps) / Number(this.STEPS_PER_UNIT);
  }

  public ProgressToTicks_UNSAFE(progress: float): int {
    return toInt(progress * Number(this.Duration_T));
  }

  // public float StepsToSeconds_UNSAFE(int steps)
  // {
  //     return steps / (float)StepsPerTick_S / (float)VIRTUAL_TICKS_PER_SECOND;
  // }
  // public float StepsToProgress_UNSAFE(int steps)
  // {
  //     return steps / (float)Length_S;
  // }

  public TicksToSeconds_UNSAFE(ticks: int): float {
    return (Number(ticks) / Number(this.Duration_T)) * this.Duration;
  }

  public TicksToProgress_UNSAFE(steps: int): float {
    return Number(steps) / Number(this.Duration_T);
  }
}
