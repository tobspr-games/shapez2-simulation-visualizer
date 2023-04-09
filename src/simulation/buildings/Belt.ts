import { BeltLane } from "@/simulation/BeltLane";
import { BeltLaneDefinition } from "@/simulation/BeltLaneDefinition";
import { BeltSimulation } from "@/simulation/BeltSimulation";
import { MapEntity } from "@/simulation/MapEntity";
import { int } from "@/simulation/polyfill";

export class BeltEntity extends MapEntity {
    public MainLane: BeltLane;

    protected static BeltDefinition: BeltLaneDefinition = new BeltLaneDefinition("Belt", 0.5, 0.5);

    constructor(posX: int, posY: int) {
        super(posX, posY);
        this.MainLane = new BeltLane("belt", BeltEntity.BeltDefinition, 0n, 0n, undefined);
    }

    public OnUpdate(deltaTicks_T: int): void {
        BeltSimulation.UpdateLane(this.MainLane, deltaTicks_T);
    }

    public GetLanes(): BeltLane[] {
        return [this.MainLane];
    }
}

export class SlowBeltEntity extends BeltEntity {
    protected TicksSaved: int = 0n;

    public Serialize() {
        return {
            TicksSaved: this.TicksSaved,
        };
    }

    public Deserialize(data: any): void {
        this.TicksSaved = data.TicksSaved;
    }

    constructor(posX: int, posY: int) {
        super(posX, posY);
        this.MainLane.Name = "SlowBelt";
    }
    public OnUpdate(deltaTicks_T: int): void {
        this.TicksSaved += deltaTicks_T;
        while (this.TicksSaved >= 4n) {
            this.TicksSaved -= 4n;
            super.OnUpdate(4n);
        }
    }
}

export class ShortBeltEntity extends BeltEntity {
    protected static BeltDefinition: BeltLaneDefinition = new BeltLaneDefinition("BeltShort", 0.2, 0.3);

    constructor(posX: int, posY: int) {
        super(posX, posY);
        this.MainLane.Definition = ShortBeltEntity.BeltDefinition;
    }
}
