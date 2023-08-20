import settings from "../config"
import { GUI_INSTRUCT } from "./constants";
import { registerWhen } from "./functions";
import { getWorld } from "./world";

// Credit: Volcaddons on ct for overlay
function renderScale(scale, text, x, y) {
  Renderer.scale(scale);
  Renderer.drawString(text, x, y);
}

export class Overlay {
  constructor(setting, worlds, loc, command, example) {
    this.setting = setting;
    this.worlds = worlds;

    this.loc = loc;
    this.X = this.loc[0]/this.loc[2];
    this.Y = this.loc[1]/this.loc[2];
    this.gui = new Gui();
    register("command", () => {
      this.gui.open();
    }).setName(command);
    
    this.example = example;
    this.message = example;
    registerWhen(register("renderOverlay", () => {
      // Adjusts split location
      if (this.gui.isOpen()) {                                 
        // Coords and scale
        renderScale(
          this.loc[2],
          `&ox: ${Math.round(this.loc[0])}, y: ${Math.round(this.loc[1])}, s: ${this.loc[2].toFixed(2)}`,
          this.X, this.Y - 10
        );
        Renderer.drawLine(Renderer.WHITE, this.loc[0], 1, this.loc[0], Renderer.screen.getHeight(), 0.5);
        Renderer.drawLine(Renderer.WHITE, Renderer.screen.getWidth(), this.loc[1], 1, this.loc[1], 0.5);
        
        // Draw example text
        renderScale(this.loc[2], this.example, this.X, this.Y);
        
        // GUI Instructions
        renderScale(
          1.2, GUI_INSTRUCT,
          Renderer.screen.getWidth() / 2 - Renderer.getStringWidth(GUI_INSTRUCT) / 1.2,
          Renderer.screen.getHeight() / 2.4,
        );
      } else {
        if (this.worlds.includes(getWorld()) || this.worlds.includes("all")) {
          // Draw HUD
          renderScale(this.loc[2], this.message, this.X, this.Y);
        }
      }
    }), () => settings[this.setting]);

    // Move HUD
    register("dragged", (dx, dy, x, y) => {
      // Changes location of text
      if (this.gui.isOpen()) {
        this.loc[0] = parseInt(x);
        this.loc[1] = parseInt(y);
        this.X = this.loc[0]/this.loc[2];
        this.Y = this.loc[1]/this.loc[2];
      } else return;
    });

    // Scale HUD
    register("guiKey", (char, keyCode, gui, event) => {
      if (this.gui.isOpen()) {
        if (keyCode == 13) {
          this.loc[2] += 0.05;
          this.X = this.loc[0]/this.loc[2];
          this.Y = this.loc[1]/this.loc[2];
        } else if (keyCode == 12) {
          this.loc[2] -= 0.05;
          this.X = this.loc[0]/this.loc[2];
          this.Y = this.loc[1]/this.loc[2];
        } else if (keyCode == 19) {
          this.loc[2] = 1;
          this.X = this.loc[0];
          this.Y = this.loc[1];
        }
      } else return;
    });
  }
}