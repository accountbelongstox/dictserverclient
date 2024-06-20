const deepPrinter = (input: any, depth: number = 0, maxDepth: number = 100): void => {
    if (depth > maxDepth) {
        console.log("Reached maximum recursion depth");
        return;
    }

    if (typeof input === 'object' && input !== null) {
        if (Array.isArray(input)) {
            for (let i = 0; i < input.length; i++) {
                console.log(`Depth: ${depth}, Index: ${i}, Value:`, input[i]);
                deepPrinter(input[i], depth + 1, maxDepth); 
            }
        } else {
            for (const key in input) {
                if (input.hasOwnProperty(key)) {
                    console.log(`Depth: ${depth}, Key: ${key}, Value:`, input[key]);
                    deepPrinter(input[key], depth + 1, maxDepth); 
                }
            }
        }
    } else {
        console.log(`Depth: ${depth}, Value:`, input);
    }
}

export { deepPrinter };