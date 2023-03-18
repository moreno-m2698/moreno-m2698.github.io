
function hiKeivan() {
    console.log("hi keivan");
  }
function addHelloWorld() {
    const myDiv = document.getElementById("myDiv");
    const newParagraph = document.createElement("p");
    const textNode = document.createTextNode("HelloWorld");
    console.log(newParagraph);
    console.log(myDiv);
    newParagraph.appendChild(textNode);
    myDiv.appendChild(newParagraph);
}