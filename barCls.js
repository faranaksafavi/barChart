class myBar {
  constructor(data, option, element) {
    this.lineDistance=30;
    this.data = data;
    console.log(this.data);
    this.dataKeys = Object.keys(this.data);
    console.log(this.dataKeys);
    this.svgS = option[0];
    this.lineS = option[3];
    this.lineVS = option[4];
    this.barS = option[1];
    this.textS = option[2];
    this.ParentHeight = option[6];
    this.firstLineS=option[5];
    this.parentElement = element;
    this.paperWidth = this.parentElement[0].clientWidth;c
    this.parentLineQt=Math.floor(this.ParentHeight/this.lineDistance);
    this.textSpaceT = this.lineDistance*2;
    this.textSpaceB = -20;
    this.dataValues = Object.values(this.data);
    this.xBarRange = this.paperWidth - 2 * this.textSpaceT;

    this.minPoint = [
      0,
      Math.min(...this.dataValues) < 0 ? Math.min(...this.dataValues) : 0,
    ];
    this.maxPoint = [this.xBarRange, Math.max(...this.dataValues)];
    this.rangePoint = [
      this.maxPoint[0] - this.minPoint[0],
      this.maxPoint[1] - this.minPoint[1],
    ];

    this.xScale = 1;
    this.textValueIncrement=[0 , Math.ceil(this.rangePoint[1]/(this.parentLineQt-3))]
    this.yScale =
      this.lineDistance/ Math.ceil(this.rangePoint[1]/(this.parentLineQt-3));
    this.verIncrement = Math.ceil(this.rangePoint[1]/(this.parentLineQt-3));
    this.dataQt = this.dataValues.length;
    this.pointIncrement = [
      Math.ceil(this.rangePoint[0] / (this.dataQt + 1)),
      Math.ceil(this.rangePoint[1]/(this.parentLineQt-3)),
    ];

    this.horLineQt = this.parentLineQt-2;
    this.verLineQt = this.dataQt + 1;
    //#region svg construct
    this.svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    this.svg.setAttribute("id", "svg_bar");
    this.svg.setAttribute("width", this.paperWidth);
    this.svg.setAttribute("height", this.ParentHeight);
    this.svg.setAttribute("overflow", "auto");
    this.parentElement.append(this.svg);
    this.svg.setAttribute("style", this.svgS);
    //#endregion
  }
  //#region setting attr functions
  setLineStyle(lS){
    this.lineS=lS;
  };
  setSvgStyle(lS){
    this.svgS=lS;
  };

  setTextStyle(lS){
    this.textS=lS;
  };
  setBarStyle(lS){
    this.barS=lS;
  };
  setMaxHeight(lS){
    this.ParentHeight=lS;
  };
  //#endregion
  // func transfer
  transferMyData(myPoint) {
    return [
      this.xScale * (myPoint[0] + this.textSpaceT),
      this.yScale * (this.rangePoint[1] - myPoint[1]) + 2* this.lineDistance,
    ];
  }
  transferMyRangePoint(myRangePoint) {
    return [this.xScale * myRangePoint[0], this.yScale * myRangePoint[1]*(-1)];
  }

  createNetLine() {
    //#region [horizontal line]
    let lineHorG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    lineHorG.setAttribute("id", "lineHorG");
    lineHorG.setAttribute("style", this.lineS);
    let start = this.transferMyData(this.minPoint)[1];
    for (var i = 0; i < this.horLineQt; i++) {
      let nameId = "path_hor_".concat(i.toString());
      let d = [
        "M",
        this.transferMyData(this.minPoint)[0],
        start,
        "l",
        this.transferMyRangePoint(this.rangePoint)[0],
        0,
      ].join(" ");
      let newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      newPath.setAttribute("id", nameId);
      newPath.setAttribute("d", d);
      start += this.transferMyRangePoint(this.pointIncrement)[1];
      lineHorG.appendChild(newPath);
    }
    this.svg.appendChild(lineHorG);
    //#endregion

   //#region [vertical net line]
    let lineVerG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    lineVerG.setAttribute("id", "lineVerG");
    lineVerG.setAttribute("style", this.lineVS);
    start = this.transferMyData(this.minPoint)[0];
    let verLines=[];
    for (var i = 0; i < this.verLineQt; i++) {
      let nameId = "path_ver_".concat(i.toString());
      let d = [
        "M",
        start,
        this.transferMyData(this.minPoint)[1],
        "l",
        0,
        this.transferMyRangePoint([0 , this.textValueIncrement[1] * (this.horLineQt -1)])[1],
      ].join(" ");
      let newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      newPath.setAttribute("id", nameId);
      newPath.setAttribute("d", d);
      start += this.transferMyRangePoint(this.pointIncrement)[0];
      lineVerG.appendChild(newPath);
      verLines.push(newPath)
    }
    let firstLineD= [
      "M",
      this.transferMyData(this.minPoint)[0],
      this.transferMyData(this.minPoint)[1],
      "l",
      0,
      this.transferMyRangePoint([0 , this.textValueIncrement[1] * (this.horLineQt -.5)])[1],"l",this.lineDistance*(-0.2),this.lineDistance*(0.2),"l",this.lineDistance*(0.4),0,"l" ,this.lineDistance*(-0.2),this.lineDistance*(-0.2)
    ].join(" ");
    verLines[0].setAttribute("d", firstLineD);
    verLines[0].setAttribute("style", this.firstLineS);
    verLines[0].setAttribute("stroke", "black");
    verLines[0].setAttribute("stroke-linejoin", "round");
    verLines[0].setAttribute("stroke-width", "2");

    this.svg.appendChild(lineVerG);
    //#endregion
    //#region vertical text
    let textVerG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    textVerG.setAttribute("id", "textVerG");
    textVerG.setAttribute("style", this.textS);
    start = this.transferMyData(this.minPoint)[1];
    let realValue=0;
    for (var i = 0; i < this.horLineQt; i++) {
      let x = this.transferMyData(this.minPoint)[0].toString();
      let deltaX = "-30";

      let nameId = "text_left_".concat(i.toString());
      let newText =document.createElementNS("http://www.w3.org/2000/svg", "text")
      newText.setAttribute("id", nameId);
      newText.setAttribute("x", x);
      newText.setAttribute("y", start.toString());
      newText.setAttribute("dx", deltaX);
      newText.append(realValue.toString());
      textVerG.appendChild(newText);
      start += this.transferMyRangePoint(this.pointIncrement)[1];
      realValue+= this.textValueIncrement[1]
    }
    this.svg.appendChild(textVerG);
    //#endregion
    //#region horizontal text
    let textHorG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    textHorG.setAttribute("id", "textHorG");
    textHorG.setAttribute("style", this.textS);
    start = this.transferMyData(this.minPoint)[0] +this.transferMyRangePoint(this.pointIncrement)[0];
    for (var i = 0; i < this.verLineQt - 1; i++) {
      let y = this.transferMyData(this.minPoint)[1].toString();
      let deltaY = "+30";

      let nameId = "text_left_".concat(i.toString());

      let newText =document.createElementNS("http://www.w3.org/2000/svg", "text")
      newText.setAttribute("id", nameId);
      newText.setAttribute("x", start.toString());
      newText.setAttribute("y", y);
      newText.setAttribute("dy", deltaY);
      newText.append(this.dataKeys[i].toString());
      textHorG.appendChild(newText);
      start += this.transferMyRangePoint(this.pointIncrement)[0];
    }
    this.svg.appendChild(textHorG);
    //#endregion
    //#region bars
    let barG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    barG.setAttribute("id", "barG");
    barG.setAttribute("style", this.barS);
    start =
      this.transferMyData(this.minPoint)[0] +
      this.transferMyRangePoint(this.pointIncrement)[0];
    for (var i = 0; i < this.dataValues.length; i++) {
      let nameId = "path_bar_".concat(i.toString());
      let d = [
        "M",
        start,
        this.transferMyData(this.minPoint)[1],
        "L",
        start,
        this.transferMyData([0, this.dataValues[i]])[1],].join(" ");
      console.log(d);
      let newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      newPath.setAttribute("id", nameId);
      newPath.setAttribute("d", d);
      start += this.transferMyRangePoint(this.pointIncrement)[0];
      barG.appendChild(newPath);
    }
    this.svg.appendChild(barG);
    //#endregion

  }
}

function drawBarChart(data, options, element) {
  console.log(typeof(element));
  let bar = new myBar(data, options, element);
  console.log(bar);
  bar.createNetLine();
  return bar;
};
