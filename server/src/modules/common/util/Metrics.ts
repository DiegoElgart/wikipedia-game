import {LogLevels} from "./LogLevels";
import {Logger} from "./Logger";

export class Metrics {

    // Decorator method.
    // Executes code before and after the method to measure how much time it took
    static meteredMethod() {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
            const originalMethod = descriptor.value;
            const className = target.constructor.name;
            const methodName = propertyKey;

            descriptor.value = async function (...args: any[]) {
                const start = performance.now();
                const result = await originalMethod.apply(this, args);
                const finish = performance.now();
                Logger.log(LogLevels.debug, `Measure: Class: ${className} Method: ${methodName}. ${(finish - start) / 1000} milliseconds`);
                console.log(`Execution time: ${finish - start} milliseconds`);
                return result;
            };

            return descriptor;
        };
    }

}
