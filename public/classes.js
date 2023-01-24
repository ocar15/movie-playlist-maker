class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    //Required methods:
    //add
     //clear
    //get

    add(data){
        if(this.size==0){
            this.head = new Node(data);
            this.tail = this.head;
            this.size++;
        } else {
            this.tail.next = new Node(data);
            this.tail = this.tail.next;
            this.size++;
        }
    }

    clear(){
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    get(index){
        if(index < 0 || index > this.size-1){
            return "Error: Tried to access out of bounds index"
        } else if(index == 0){
            return this.head.data
        } else if(index == this.size-1){
            return this.tail.data
        } else {
           let count = 0;
           for(let current = this.head; current != null; current=current.next){
            if(count == index){
                return current.data;
            }
            count++;
           }
        }
    }

}

module.exports = {
    Node, LinkedList
};