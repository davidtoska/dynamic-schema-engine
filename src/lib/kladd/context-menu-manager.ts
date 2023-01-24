// @ts-ignore
class ContextMenuManager {
  private static ROOT = document.createElement("div");
  public static hasMenu = false;
  private hasMenu = false;

  createMenu() {
    const root = document.createElement("div");
    const menu = document.createElement("div");
    const backDrop = document.createElement("div");
    backDrop.style.position = "fixed";
    backDrop.style.height = "100vh";
    backDrop.style.width = "100vw";
    backDrop.style.backgroundColor = "rgba(255, 0, 0, 0.25)";
    backDrop.style.top = "0";
    backDrop.style.right = "0";
    backDrop.style.zIndex = "1000";
    // backDrop.style.opacity = '0.5';

    menu.style.height = "50%";
    menu.style.width = "50%";
    menu.style.top = "10%";
    menu.style.right = "25%";
    menu.style.backgroundColor = "green";
    menu.style.position = "absolute";
    menu.style.zIndex = "1001";
    menu.contentEditable = "false";
    const createOption = (text: string) => {
      const p = document.createElement("p");
      p.textContent = text;
      return p;
    };

    const options = ["Select On-Click Actions", "Select On-Hover Actions"].map(
      createOption
    );
    options.forEach((op) => {
      menu.appendChild(op);
    });
    root.appendChild(backDrop);
    root.appendChild(menu);
    document.body.appendChild(root);
    this.hasMenu = true;
    backDrop.onclick = (ev: MouseEvent) => {
      console.log("BACKDROP CLICKED");
      console.log(ev.type);
      root.removeChild(backDrop);
      root.removeChild(menu);
      this.hasMenu = false;
    };

    menu.onclick = (_: MouseEvent) => {
      console.log("NODE CLICKED");
    };
  }
}
