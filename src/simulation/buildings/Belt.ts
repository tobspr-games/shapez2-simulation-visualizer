import { BeltLane } from "@/simulation/BeltLane";
import { BeltLaneDefinition } from "@/simulation/BeltLaneDefinition";
import { BeltSimulation } from "@/simulation/BeltSimulation";
import { MapEntity } from "@/simulation/MapEntity";
import { int } from "@/simulation/polyfill";

export class BeltEntity extends MapEntity {
    public MainLane: BeltLane;

    protected static BeltDefinition: BeltLaneDefinition = new BeltLaneDefinition("Belt", 0.5, 0.5);

    constructor(posX: int, posY: int, posXw: int, posYw: int) {
        super();
        this.MainLane = new BeltLane("belt", BeltEntity.BeltDefinition, posX, posY, posXw, posYw, undefined);
    }

    public OnUpdate(deltaTicks_T: int): void {
        BeltSimulation.UpdateLane(this.MainLane, deltaTicks_T);
    }

    public GetLanes(): BeltLane[] {
        return [this.MainLane];
    }
}

export class SlowBeltEntity extends BeltEntity {
    protected ticksSaved: int = 0n;

    constructor(posX: int, posY: int, posXw: int, posYw: int) {
        super(posX, posY, posXw, posYw);
        this.MainLane.Name = "SlowBelt";
    }
    public OnUpdate(deltaTicks_T: int): void {
        this.ticksSaved += deltaTicks_T;
        while (this.ticksSaved >= 4n) {
            this.ticksSaved -= 4n;
            super.OnUpdate(4n);
        }
    }
}
