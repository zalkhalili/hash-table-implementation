class KeyValuePair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.next = null;
    }
}

class HashTable { // get O(1), set O(1), deleteKey O(1)

    constructor(numBuckets = 8) {


        this.count = 0;
        this.numBuckets = numBuckets;
        this.capacity = numBuckets;

        //create a new data array
        this.data = new Array(numBuckets);

        //fill empty array with null
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] = null;
        }

    }

    hash(key) {
        let hashValue = 0;

        for (let i = 0; i < key.length; i++) {
            hashValue += key.charCodeAt(i);
        }

        return hashValue;
    }

    hashMod(key) {
        // Get index after hashing
        return this.hash(key) % this.capacity;
    }


    insert(key, value) {
        /*
        load factor will call the resize() automatically if the number of
        length of items in the array are about 70% full
        */
        const loadFactor = this.count / this.capacity;

        if (loadFactor >= 0.7) {
            this.resize();
        }

        //hash the key and get the current index(bucket)
        let index = this.hashMod(key);
        let current = this.data[index];

        //traverse through the data array to update any same k/v pairs
        while (current) {
            if (current.key === key) {
                current.value = value;
                return;
            }
            current = current.next;
        }

        //create new key/value pair
        //set the new k/v pair's next to the current k/v pair
        //set the new current as the new k/v pair
        let pair = new KeyValuePair(key, value);

        pair.next = this.data[index];
        this.data[index] = pair;
        this.count++;
        return
    }


    read(key) {
        //hash the key and get the current index(bucket)
        let index = this.hashMod(key);
        let current = this.data[index];

        //check to see if the index is empty
        if (!current) return undefined;

        //traverse through array until key matches current and return
        while (current) {
            if (current.key === key) {
                return current.value;
            }
            current = current.next;
        }
    }


    resize() {
        //set a new size using this.capacity
        //create a new HashTable
        //create a copy of current HashTable data
        let size = this.capacity * 2;
        let newHash = new HashTable(size);
        let hashTable = this.data;

        //for each object in the data array
        //if an object exists, set current to the current object
        //while it's current, insert the old k/v pairs into the new HashTable
        hashTable.forEach(obj => {
            if (obj) {
                let current = obj;

                while (current) {
                    newHash.insert(current.key, current.value);
                    current = current.next;
                }
            }
        });

        //set the old data array to the new data array
        //change the size
        this.data = newHash.data;
        this.capacity = size;
    }


    delete(key) {
        //hash the key and get the current index(bucket)
        let index = this.hashMod(key);

        //if the index/bucket exists
        if (this.data[index]) {

            //create a copy of the current into a new variable
            //create a next variable and set it to the new current variables next
            let current = this.data[index];
            let next = current.next;

            //if the current key matches the inputs
            //if the current does not have any next values
            //set data[index] to null, decrease count and return
            //else, set the data[index] to its next k/v, decrease count and return 
            if (current.key === key) {
                if (!next) {
                    this.data[index] = null;
                    this.count--;
                    return;
                }
                else {
                    this.data[index] = next;
                    this.count--;
                    return;
                }
            }

            //traverse through the next variable
            //if the key to next is equal to the input
            //set the current next to it's next value
            //current --> next --> next.value
            //decrease count and return
            //return if key is not found
            while (next) {
                if (next.key === key) {
                    current.next = next.next;
                    this.count--;
                    return;
                }
                current = next;
                next = next.next;
            }
        }
        return `Key not found`
    }
}