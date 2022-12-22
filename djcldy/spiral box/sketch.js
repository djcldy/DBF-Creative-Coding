let numRooms = 10
let arr2 = []

let adjacencyMatrixCopy = null 
let adjacencyMatrix = generateAdjacencyMatrix(numRooms);

let departments = generateDepartments(numRooms);


let remaining = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
let backlog = []
let placed = []



let currentID = null



function setup() {

    createCanvas(1200, 1200);
    background(200)


    // 1. Place first rectangle 


    currentID = remaining.shift()
    backlog.push(currentID)
    adjacencyMatrixCopy = adjacencyMatrix.slice()

    initializeDepartment(departments[currentID], currentID) // draws department 0 
    console.log(departments[currentID])

    let id = 0
    let iterations = 10

    while (remaining.length > 0 && iterations >0) {

        currentID = backlog[0]
        console.log('running', currentID, 'remaining:', remaining.length)

        let obj = departments[currentID]

        if (currentID === undefined) {
          console.log('done!')
          iterations--
          return
        }

        if (spiral(obj, adjacencyMatrix[id], id)){
          backlog.shift()
        }

      
    }

}


// Remove a specific number from an array
function removeNumber(arr, num) {
    let index = arr.indexOf(num);
    if (index > -1) {
        arr.splice(index, 1);
    }
}

function initializeDepartment(obj, id) {

    // first department 
    obj.x = width / 2
    obj.y = height / 2
    drawDepartment(obj, id)

    console.log(obj)

}


function spiral(obj, rel, id) {


    let adjacencies = getAdjacentIDs(id, rel)
    let adjacentIDs = []

    if (adjacencies.length === 0) {

      // create new connection  
      let id2 = remaining[0]
      adjacencyMatrix[id][id2] = true
      adjacencyMatrix[id2][id] = true
      return false 

    } else { 

     adjacentIDs = sortAdjacentIDs(adjacencies, adjacencyMatrix) // place adjacent rooms together in a sequence 

    }


    let numIterations = 0 


    let full = true
    let anchor = { x: null, y: null }
    let prevDepartment = {x:null, y:null, w:null, h:null}
    let edge = 0


    while (adjacentIDs.length > 0 && numIterations < 100){



        let i = adjacentIDs[0]
        if (i === id) {
          adjacentIDs.shift()
          continue
        }


        if (!fullEdge(edge,prevDepartment,anchor,obj)){

          placeDepartment(departments[i], anchor, edge, i)
          let prevDepartment = departments[i] 
          edge++ 

        } else {

          anchor = switchEdge(obj, anchor, edge) // switch edge if full 

        }

      numIterations++

    }
  }








    // for (var pp = 0; pp < adjacentIDs.length; pp++) {

    //     let i = adjacentIDs[pp]
    //     if (i === id /*|| rel[i] === false*/ ) continue
    //     if (full === true) anchor = switchEdge(obj, anchor, edge) // switch edge if full 



    //     placeDepartment(departments[i], anchor, edge, i)

    //     let department = departments[i]

    //     if (edge === 0) {

    //         let dx = anchor.x + department.w
    //         let xBounds = obj.x + obj.w / 2
    //         // console.log("anchor:", anchor, "obj.w", "dx:",dx,"xBounds:",xBounds)

    //         if (dx > xBounds) {

    //             edge++
    //             full = true

    //         } else {

    //             anchor.x = dx
    //             full = false

    //         }

    //         continue

    //     }

    //     if (edge === 1) {


    //         let dy = anchor.y + department.h
    //         let yBounds = obj.y + obj.h / 2


    //         if (dy > yBounds) {

    //             edge++
    //             full = true

    //         } else {

    //             anchor.y = dy
    //             full = false

    //         }

    //         continue
    //     }

    //     if (edge === 2) {

    //         let dx = anchor.x - department.w
    //         let xBounds = obj.x - obj.w / 2


    //         if (dx < xBounds) {

    //             edge++
    //             full = true

    //         } else {

    //             anchor.x = dx
    //             full = false

    //         }
    //         continue

    //     }

    //     if (edge === 3) {


    //         let dy = anchor.y - department.h
    //         let yBounds = obj.y - obj.h / 2


    //         if (dy < yBounds) {

    //             edge++
    //             full = true

    //         } else {

    //             anchor.y = dy
    //             full = false


    //         }
    //         continue
    //     }



    //     edge++


    // }

    // return true 


// }


function fullEdge(edge,department,anchor,obj){

      if (edge === 0) {

            let dx = anchor.x + department.w
            let xBounds = obj.x + obj.w / 2
            // console.log("anchor:", anchor, "obj.w", "dx:",dx,"xBounds:",xBounds)

            if (dx > xBounds) {

                edge++
                return true

            } else {

                anchor.x = dx
                return false

            }

            return {edge,deparment,anchor,full}

        }

        if (edge === 1) {


            let dy = anchor.y + department.h
            let yBounds = obj.y + obj.h / 2


            if (dy > yBounds) {

                edge++
                return true

            } else {

                anchor.y = dy
                return false

            }

            return
        }

        if (edge === 2) {

            let dx = anchor.x - department.w
            let xBounds = obj.x - obj.w / 2


            if (dx < xBounds) {

                edge++
                return true

            } else {

                anchor.x = dx
                return false

            }


        }

        if (edge === 3) {


            let dy = anchor.y - department.h
            let yBounds = obj.y - obj.h / 2


            if (dy < yBounds) {

                edge++
                return true

            } else {

                anchor.y = dy
                return false


            }
            return
        }




}

function sortAdjacentIDs(ids, adj) {

    let arr = []



    for (var i = 0; i < ids.length; i++) {

        // let temp = [JSON.stringify([ids[i]])]
        let temp = [ids[i]]

        let rel = adj[ids[i]] // checking ID 1 

        for (var j = 0; j < rel.length; j++) {

            // check if connectivity

            if (rel[j] === false) continue

            // check if withinin ids list 

            for (var k = 0; k < ids.length; k++) {


                if (ids[k] === ids[i]) continue
                // console.log(ids[k], j)
                if (ids[k] === j) temp.push(ids[k])
                continue
            }



        }

        arr.push(temp)




    }

    let result = checkAndAdd(ids, getLongestArray(arr))
    return result

}


function checkAndAdd(arr1, arr2) {

    for (let i = 0; i < arr1.length; i++) {
        if (!arr2.includes(arr1[i])) {
            arr2.push(arr1[i]);
        }
    }
    return arr2

}


function getLongestArray(arrays) {
    let longestArray = arrays[0];
    for (let i = 1; i < arrays.length; i++) {
        if (arrays[i].length > longestArray.length) {
            longestArray = arrays[i];
        }
    }
    return longestArray;
}




function getAdjacentIDs(id, matrix) {

    let arr = []


    for (var i = 0; i < matrix.length; i++) {

        // console.log(matrix[i])

        if (i === id) continue

        if (!matrix[i]) continue

        if (numberInArray(remaining, i)) arr.push(i)

    }


    return arr

}

function numberInArray(arr, num) {
    return arr.includes(num);
}

function switchEdge(obj, anchor, edge) {


    if (edge === 0) {

        anchor.x = obj.x - obj.w / 2
        anchor.y = obj.y - obj.h / 2

    }

    if (edge === 1) {

        anchor.x = obj.x + obj.w / 2
        anchor.y = obj.y - obj.h / 2

    }

    if (edge === 2) {

        anchor.x = obj.x + obj.w / 2
        anchor.y = obj.y + obj.h / 2

    }

    if (edge === 3) {

        anchor.x = obj.x - obj.w / 2
        anchor.y = obj.y + obj.h / 2

    }

    return anchor
}


function placeDepartment(department, anchor, edge, id) {


  if (edge > 3) {

    return false 

  }


    if (edge === 0) {

        department.x = department.w / 2 + anchor.x
        department.y = -department.h / 2 + anchor.y

    }

    if (edge === 1) {

        department.x = department.w / 2 + anchor.x
        department.y = department.h / 2 + anchor.y

    }


    if (edge === 2) {

        department.x = -department.w / 2 + anchor.x
        department.y = department.h / 2 + anchor.y

    }

    if (edge === 3) {

        department.x = -department.w / 2 + anchor.x
        department.y = -department.h / 2 + anchor.y
    }

    // check for intersection 

    if (intersectsRectangles(department,placed)){

      edge++ 
      console.log('try edge', edge)
      placeDepartment(department, anchor, edge, id) 

      // return 
 
    } else { 

      backlog.push(id)
      removeNumber(remaining, id)
      drawDepartment(department, id)
      placed.push(id)

      return true 

    }


}



function intersectsRectangles({x,y,w,h}, uids) {

  console.log(uids)




  for (const id of uids) {

    let rectangle = departments[id]

    console.log(rectangle)
    if (x < rectangle.x + rectangle.w && x + w > rectangle.x && y < rectangle.y + rectangle.h && h + y > rectangle.y) { 
      return true;
    }

  }
  return false;
}


let drawID = 0


function drawDepartment({ x, y, w, h }, id) {

    textSize(6);
    fill(255)
    stroke(0)
    rectMode(CENTER)
    rect(x, y, w, h)
    fill(0)
    text(id, x, y)
    // drawID++

}







function generateAdjacencyMatrix(num) {
    let matrix = [];
    for (let i = 0; i < num; i++) {
        matrix[i] = [];
        for (let j = 0; j < num; j++) {
            matrix[i][j] = Math.random() >= 0.5;
        }
    }
    return matrix;
}

// Example usage



function generateDepartments(num) {
    let objects = [];
    for (let i = 0; i < num; i++) {
        let object = {
            w: Math.floor(Math.random() * 91) + 10,
            h: Math.floor(Math.random() * 91) + 10,
            x: null,
            y: null,
            adj: [],
        };
        objects.push(object);
    }
    return objects;
}


function sumBooleanArray(arr) {

    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
            sum++;
        }
    }
    return sum;

}