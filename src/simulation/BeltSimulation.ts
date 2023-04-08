import { BeltItem } from "@/simulation/BeltItem";
import { BeltLane } from "@/simulation/BeltLane";
import { BeltLaneDefinition } from "@/simulation/BeltLaneDefinition";
import { max, min, int, float, toInt, bool } from "@/simulation/polyfill";

export class BeltSimulation {
    public static UpdateLane(lane: BeltLane, delta_T: int): bool {
        if (delta_T < 0n) {
            throw new Error("Negative delta: " + delta_T + " for " + lane);
        }

        let maxStep_S: int = lane.ComputeMaxStepWhenEmpty_S();

        // If we have no item, simply set the max progress and we're good
        if (lane.Empty) {
            lane.MaxStep_S = maxStep_S;
            return false;
        }

        var definition = lane.Definition;
        var nextLane = lane.NextLane;

        // Debug.Log("Update lane " + lane + " maxP=" + maxProgress_W);

        if (lane.ProgressClampHook != null) {
            var newProgress = lane.ProgressClampHook?.(lane, maxStep_S);
            // Clipping required on merger for example, so not an error
            // #if UNITY_EDITOR
            //             if (newProgress > maxProgress_W)
            //             {
            //                 Debug.LogError(
            //                     "Progress clamp hook for "
            //                         + lane
            //                         + " returned "
            //                         + newProgress
            //                         + " but maximum is "
            //                         + maxProgress_W
            //                         + " -> will lead to clipping!"
            //                 );
            //             }
            // #endif
            maxStep_S = newProgress;
        }

        if (maxStep_S < 0n) {
            // The item is not actually allowed to be here. Do not update it. Should not happen!
            console.error(
                "maxStep_S < 0 but have item! Lane=" + lane + " next=" + nextLane + " maxStep_S=" + maxStep_S,
            );
            lane.Progress_T = 0n;
            return false;
        }

        var laneLength_S: int = definition.Length_S;
        var laneDuration_T: int = definition.Duration_T;

        if (maxStep_S >= laneLength_S && nextLane != null && !nextLane.HasItem) {
            // We can potentially go to the end of the lane and beyond
            lane.Progress_T += delta_T;

            if (lane.Progress_T >= laneDuration_T) {
                // Transfer to the next lane
                if (nextLane.HasItem) {
                    throw new Error(
                        "Next lane has item but announced space: Lane=" +
                            lane +
                            " Next=" +
                            nextLane +
                            " maxStep_S=" +
                            maxStep_S,
                    );
                }

                if (this.TransferToLane(lane.Item!, nextLane, lane.Progress_T - laneDuration_T)) {
                    // Lane was transferred
                    // Now recompute our max progress again, since it may have changed
                    lane.ClearLane();
                    return true;
                } else {
                    // Lane still has item, clamp progress
                    lane.Progress_T = laneDuration_T - 1n;
                    this.UpdateLaneMaxProgressWithItem(lane);
                    return false;
                }
            } else {
                // Also update our max progress
                this.UpdateLaneMaxProgressWithItem(lane);
                return false;
            }
        } else {
            // We are stuck to our local lane progress and won't reach the end this tick
            var maxTicks_T: int = min(lane.Definition.StepsToTicks_T(maxStep_S), laneDuration_T - 1n);
            // console.log(
            //     "Max ticks for " + lane.Name + " : " + maxTicks_T + " / " + lane.Definition.Duration_T,
            //     "laneDuration_T = ",
            //     laneDuration_T,
            //     "maxStep_S=",
            //     maxStep_S,
            //     "steps2ticks(maxStep_S: ",
            //     maxStep_S,
            //     ")=",
            //     lane.Definition.StepsToTicks_T(maxStep_S),
            // );

            if (lane.Progress_T > maxTicks_T) {
                // This lane went farther than it should already
                if (lane.NextLane == null) {
                    // This can happen if we removed an item
                    console.warn(
                        "Lane progress > max on END lane (not neccesarily an error, removing): " +
                            lane +
                            " -> " +
                            lane.NextLane +
                            " maxStep_S=" +
                            maxStep_S +
                            " maxTicks_T=" +
                            maxTicks_T,
                    );
                    lane.ClearLane();
                    return false;
                } else {
                    // This is bad, it means the item will clip, and should never occur
                    console.warn(
                        "Lane progress > max on connected lane, clearing item" +
                            lane +
                            " -> " +
                            lane.NextLane +
                            " maxStep_S=" +
                            maxStep_S,
                    );
                    lane.ClearLane();
                    return false;
                }
            } else {
                // Regular progression
                lane.Progress_T = min(lane.Progress_T + delta_T, maxTicks_T);
            }

            // Also update our max progress since we now have an item
            this.UpdateLaneMaxProgressWithItem(lane);
            return false;
        }
    }

    public static UpdateLaneMaxProgressWithItem(lane: BeltLane): void {
        var steps_S: int = lane.Progress_T * lane.Definition.StepsPerTick_S;
        lane.MaxStep_S = min(0n, steps_S - BeltLaneDefinition.SPACING_S);
    }

    // Public static so the belt path can access it
    public static TransferToLane(itemToTransfer: BeltItem, nextLane: BeltLane, remainingTicks: int): bool {
        if (nextLane.HasItem) {
            return false;
        }

        if (itemToTransfer == null) {
            throw new Error("Item to transfer to " + nextLane + " but lane is empty!");
        }

        var nextDefinition = nextLane.Definition;

        // Lane filters
        // if (!nextDefinition.CheckFilters(itemToTransfer))
        // {
        //     return false;
        // }

        // Pre accept hook
        var preAcceptHook = nextLane.PreAcceptHook;
        if (preAcceptHook != null) {
            itemToTransfer = preAcceptHook(itemToTransfer);
            if (itemToTransfer == null) {
                // Cancelled by pre-accept hook
                return false;
            }
        }

        // First, transfer the item to the very beginning of the new lane
        nextLane.Item = itemToTransfer;
        nextLane.Progress_T = 0n;

        // Write a magic value to the MaxStep so we can check it was adjusted afterwards
        var laneSentinel: int = -2121212121n;
        nextLane.MaxStep_S = laneSentinel;

        // Post accept hook (is allowed to clear or replace the item!)
        if (nextLane.PostAcceptHook != null) {
            nextLane.PostAcceptHook(nextLane, remainingTicks);
        }

        if (nextLane.HasItem) {
            // Transfer was successful, update remaining lane
            this.UpdateLane(nextLane, remainingTicks);
        } else {
            // Was consumed, don't update
            // Debug.LogWarning("HOOK: Post accept hook consumed item on lane " + nextLane);
        }

        if (nextLane.MaxStep_S == laneSentinel) {
            console.error(
                "Lane " +
                    nextLane +
                    " MaxProgress_W has not been updated after accepting item! This is most likely caused by the post accept hook consuming the item but not setting the MaxProgress_W property afterwards. ",
            );
        }

        return true;
    }
}
