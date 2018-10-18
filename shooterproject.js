import { game, Sprite } from "./sgc/sgc.js";
game.setBackground("floor.png");


class playerWizard extends Sprite {
    constructor() {
        super();
        this.name = "Marcus the Wizard";
        this.setImage("marcusSheet.png");
        this.width = 48;
        this.height = 48;
        this.x = 48;
        this.y = 48;
        this.defineAnimation("down", 6, 8);
        this.defineAnimation("up", 0, 2);
        this.defineAnimation("left", 9, 11);
        this.defineAnimation("right", 3, 5);
        this.speedWhenWalking = 200;
        this.spellCastTime = 0;
    }
    handleDownArrowKey() {
        this.playAnimation("down");
        this.speed = this.speedWhenWalking;
        this.angle = 270;
    }
    handleUpArrowKey() {
        this.playAnimation("up");
        this.speed = this.speedWhenWalking;
        this.angle = 90;
    }
    handleLeftArrowKey() {
        this.playAnimation("left");
        this.speed = this.speedWhenWalking;
        this.angle = 180;
    }
    handleRightArrowKey() {
        this.playAnimation("right");
        this.speed = this.speedWhenWalking;
        this.angle = 360;
    }
    handleGameLoop() {
        this.y = Math.max(25, this.y);
        this.y = Math.min(game.displayHeight - this.height, this.y);
        this.speed = 0;
    }

    handleSpacebar() {
        let now = game.getTime();
        if (now - this.spellCastTime >= 2) {
            this.spellCastTime = now;
            let spell = new Spell();
            spell.name = "A spell cast by Marcus";
            spell.setImage("marcusSpell48.png");
            spell.x = this.x;
            spell.y = this.y + this.height;
            spell.angle = 270;
            this.defineAnimation("down", 6, 8);
            this.playAnimation("down");
        }
    }
}
let marcus = new playerWizard();


class Spell extends Sprite {
    constructor() {
        super();
        this.name = "Spell";
        this.speed = 200;
        this.height = 48;
        this.width = 48;
        this.defineAnimation("magic", 0, 7);
        this.playAnimation("magic", true);
    }
    handleBoundaryContact() {
        game.removeSprite(this);
    }
    handleCollision(otherSprite) {
        if (this.getImage() !== otherSprite.getImage()) {
            let verticalOffset = Math.abs(this.y - otherSprite.y);
            if (verticalOffset < this.height / 2) {
                game.removeSprite(this);
                new Fireball(otherSprite);
            }
        }
        return false;
    }
}

class NonPlayerWizard extends Sprite {
    constructor() {
        super();
        this.name = "The mysterious stranger";
        this.setImage("strangerSheet.png");
        this.width = 48;
        this.height = 48;
        this.x = game.displayWidth - 2 * this.width;
        this.y = game.displayHeight - 2 * this.height;
        this.angle = 180;
        this.speed = 150;
        this.defineAnimation("down", 6, 8);
        this.defineAnimation("up", 0, 2);
        this.defineAnimation("left", 9, 11);
        this.defineAnimation("right", 3, 5);
        this.playAnimation("left");
    }
    handleGameLoop() {
        if (this.x <= 0) {
            this.x = 0;
            this.angle = 0;
            this.playAnimation("right");
        }
        if (this.x >= game.displayWidth - this.width) {
            this.x = game.displayWidth - this.width;
            this.angle = 180;
            this.playAnimation("left");
        }
        if (Math.random() < 0.01) {
            let spell = new Spell();
            spell.name = "A spell cast by Stranger";
            spell.setImage("strangerSpell48.png");
            spell.x = this.x;
            spell.y = this.y - this.height;
            spell.angle = 90;
        }
    }
    handleAnimationEnd() {
        if (this.angle === 180) {
            this.playAnimation("left");
        }
        if (this.angle === 0) {
            this.playAnimation("right");
        }
    }
}

let stranger = new NonPlayerWizard();

class Fireball extends Sprite {
    constructor(deadSprite) {
        super();
        this.x = deadSprite.x;
        this.y = deadSprite.y;
        this.setImage("fireballSheet.png");
        this.name = "A ball of fire";
        game.removeSprite(deadSprite);
        this.defineAnimation("explode", 0, 16);
        this.playAnimation("explode");
    }
    handleAnimationEnd() {
        game.removeSprite(this);
        if (!game.isActiveSprite(stranger)) {
            game.end("Congratulations!\n\nMarcus has defeated the myserious" +
                "\nstranger in the dark cloak!");
        }
        if (!game.isActiveSprite(marcus)) {
            game.end("Marcus is defeated by the mysterious" +
                "\nstranger in the dark cloak!\n\nBetter luck next time.");
        }
    }
}
