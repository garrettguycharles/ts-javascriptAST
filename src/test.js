let outerString = "outerString";

module.exports = {
    makeAString(inside) {

        inside.dog = "hello";

        return inside.dog + "is a string";
    },

    bark() {
        console.log("BARK!");
    }
};

module.exports.makeAString("Yeet");