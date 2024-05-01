import { onWorldLeave } from "../../utils/functions"

// const reference = JSON.parse(FileLib.read("NwjnAddons/features/Kuudra", "KuudraData.json"))
const references = {
  supplies: [true, true, true, true, true, true],
  preLoc: [0, 0, 0]
}

// TODO: find players in the run and save them as teammates
class KuudraUtil {
  constructor() {
    this.registers = []
    this.reset()

    // TODO: add pre-fight phase for message "Starting in 5"
    // register("chat", () => {
    //   this.phase = 0
    //   this.setRegisters()
    // }).setCriteria("")

    register("chat", () => {
      this.phase = 1
      this.setRegisters()
    }).setCriteria("[NPC] Elle: Okay adventurers, I will go and fish up Kuudra!")

    register("chat", () => {
      this.phase = 2
      this.setRegisters()
    }).setCriteria("[NPC] Elle: OMG! Great work collecting my supplies!")

    register("chat", () => {
      this.phase = 3
      this.setRegisters()
    }).setCriteria("[NPC] Elle: Phew! The Ballista is finally ready! It should be strong enough to tank Kuudra's blows now!")

    register("chat", () => {
      this.phase = 4
      this.setRegisters()
    }).setCriteria("[NPC] Elle: POW! SURELY THAT'S IT! I don't think he has any more in him!");

    onWorldLeave(() => {
      this.reset()
    })
  }
  
  /**
   * Resets all variables
   */
  reset() {
    this.supplies = references.supplies
    this.phase = false
    this.preSpot = ""
    this.preLoc = references.preLoc
    this.missing = ""
    this.freshers = new Set()
    this.freshTime = 0
    this.build = 0

    this.setRegisters(false)
  }

  /**
   * True -> When in a real phase
   * @returns {Boolean}
   */
  inKuudra() {
    return Boolean(this.phase)
  }

  /**
   * True -> Phase in param is current phase
   * @param {Number} phase 
   * @returns {Boolean}
   */
  isPhase(phase) {
    return (this.phase == phase)
  }

  registerWhen(trigger, dependency, active = false) {
    (this.registers).push([trigger.unregister(), dependency, active]);
  }

  setRegisters(on = true) {
    (this.registers).forEach(trigger => {
      if (trigger[1]() && !trigger[2]) {
        trigger[0].register();
        trigger[2] = true;
      } else if ((!trigger[1]() && trigger[2]) || !on) {
        trigger[0].unregister();
        trigger[2] = false;
      }
    });
  }
}

export default new KuudraUtil;