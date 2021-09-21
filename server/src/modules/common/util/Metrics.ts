export function logTime() {
    return function(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log(target, propertyKey, descriptor);
    };
}