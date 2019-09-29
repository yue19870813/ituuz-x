import TreeNode from "./TreeNode";

export default class MultiwayTree {
    
    public _root: TreeNode;

    public constructor() {
        this._root = null;
    }

    //深度优先遍历
    public traverseDF(callback) {
        let stack = [];
        let found = false;
        stack.unshift(this._root);
        let currentNode = stack.shift();
        while(!found && currentNode) {
            found = callback(currentNode) === true ? true : false;
            if (!found) {
                stack.unshift(...currentNode.children);
                currentNode = stack.shift();
            }
        }

    }
    //广度优先遍历
    public traverseBF(callback) {
        let queue = [];
        let found = false;
        queue.push(this._root);
        let currentNode = queue.shift();
        while(!found && currentNode) {
            found = callback(currentNode) === true ? true : false;
            if (!found) {
                queue.push(...currentNode.children)
                currentNode = queue.shift();
            }
        }
    }

    public add(data: any, toData: any, traversal) {
        let node = new TreeNode(data);
        // 第一次添加到根节点
        // 返回值为this，便于链式添加节点
        if (this._root === null) {
            this._root = node;
            return this;
        }
        let parent = null;
        let callback = function(node) {
            if (node.data === toData) {
                parent = node;
                return true;
            }
        };

        // 根据遍历方法查找父节点（遍历方法后面会讲到），然后把节点添加到父节点
        // 的children数组里
        // 查找方法contains后面会讲到
        traversal.call(this, callback);

        // this.contains(callback, traversal);  
        this.contains(callback, traversal); 
        if (parent) {
            parent.children.push(node);
            node.parent = parent;
            return this;
        } else {
            throw new Error('Cannot add node to a non-existent parent.');
        }
    }

    public contains(callback, traversal) {
        traversal.call(this, callback);
    }

    public remove(data, fromData, traversal) {
        let parent = null;
        let childToRemove = null;
        let callback = function(node) {
            if (node.data === fromData) {
                parent = node;
                return true;
            }
        };

        this.contains(callback, traversal);    
        if (parent) {
            let index = this._findIndex(parent.children, data);
            if (index < 0) {
                throw new Error('Node to remove does not exist.');
            } else {
                childToRemove = parent.children.splice(index, 1);
            }
        } else {
            throw new Error('Parent does not exist.');
        }
        return childToRemove;
    }

    public _findIndex(arr, data) {
        let index = -1;
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i].data === data) {
                index = i;
                break;
            }
        }
        return index;
    }
//  ———————————————— 
// 版权声明：本文为CSDN博主「winjowind」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
// 原文链接：https://blog.csdn.net/bluesheaven/article/details/53235917

}