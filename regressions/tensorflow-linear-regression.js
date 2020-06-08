const tf = require('@tensorflow/tfjs');
const _ = require('lodash');

class LinearRegression {
    constructor(features, labels, options) {
        this.features = tf.tensor(features);
        this.labels = tf.tensor(labels);

        this.features = tf.ones([this.features.shape[0], 1]).concat(this.features, 1);

        this.options = Object.assign({learningRate: 0.1, iterations: 1000}, options);

        this.weights = tf.zeros([2, 1]);
    }


    gradientDescent() {
        //matMul() is a matrix multiplication
        const currentGuesses = this.features.matMul(this.weights);
        const differences = currentGuesses.sub(this.labels);

        const slopes = this.features
            .transpose()
            .matMul(differences)
            .div(this.features.shape[0])

        this.weights = this.weights.sub(slopes.mul(this.options.learningRate));
    }

    train() {
        for (let i = 0; i < this.options.iterations; i++) {
            this.gradientDescent();
        }
    }

    test(testFeatures, testLabels) {
        testFeatures = tf.tensor(testFeatures);
        testLabels = tf.tensor(testLabels);

        testFeatures = tf.ones([testFeatures.shape[0], 1]).concat(testFeatures, 1);
        const predictions = testFeatures.matMul(this.weights);


        //sum of squares of residuals
        const res = testLabels.sub(predictions).pow(2).sum().get();

        //total sum of squares
        const tot = testLabels.sub(testLabels.mean()).pow(2).sum().get();

        //Coefficient of Determination

        return 1 - res / tot;

    }

    processFeatures(features){
        features = tf.tensor(features);
        features = tf.ones([features.shape[0], 1]).concat(features, 1);

        return features;
    }
}

module.exports = LinearRegression;