class Button {

    constructor(label, x, y) {

        this.label = label;
        this.x = x;
        this.y = y;
        this.hovered = false;
    }

    display() {

        push();

        translate(this.x, this.y);
        rectMode(CENTER);
        noStroke();

        if (this.hovered) {
            fill(white);
        } else {
            if (validation || win) {
                fill(dark);
            } else {
                fill(mid);
            }
        }
        rect(0, 0, 200, 40, 3);

        textAlign(CENTER, CENTER);
        textFont('Fira Code');
        textSize(18);

        if (this.hovered) {
            fill(dark);
        } else {
            fill(white);
        }
        text(this.label, 0, 1);

        pop();
    }

    hover(x, y) {

        if (x > this.x - 100 && x < this.x + 100 && y > this.y - 20 && y < this.y + 20) {
            this.hovered = true;
        } else {
            this.hovered = false;
        }
    }

    clicked(x, y) {

        if (x > this.x - 100 && x < this.x + 100 && y > this.y - 20 && y < this.y + 20) {
            return true;
        }
        return false;
    }
}
