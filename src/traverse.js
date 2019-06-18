/*
 * @author David Menger
 */
'use strict';


function appendInObject (obj, key, res, nextPath) {

    let finalObj;
    let finalKey;

    if (nextPath) {
        const chain = nextPath.split('.');
        chain.unshift(key);
        finalKey = chain.pop();

        finalObj = chain.reduce((o, attr) => {
            if (typeof o[attr] === 'undefined') {
                Object.assign(o, { [attr]: {} });
            }
            return o[attr];
        }, obj);
    } else {
        finalKey = key;
        finalObj = obj;
    }

    finalObj[finalKey] = res;
}


function traverse (path, fn, dataObject, obj, stackPath) {

    const match = path.match(/^([^.[\]]+)(\[])?\.?(.*)$/);
    const key = match[1];
    const isArray = match[2];
    const nextPath = match[3];

    if (isArray) {
        if (Array.isArray(dataObject[key])) {
            if (typeof obj[key] === 'undefined') {
                Object.assign(obj, { [key]: [] });
            }
            dataObject[key].forEach((val, i) => {
                if (typeof obj[key][i] === 'undefined') {
                    Object.assign(obj[key], { [i]: {} });
                }
                if (nextPath && typeof val === 'object') {
                    const currentPath = `${stackPath}${key}[${i}].`;
                    traverse(nextPath, fn, val, obj[key][i], currentPath);
                } else if (!nextPath) {
                    const res = fn(val, `${stackPath}${key}[${i}]`);
                    Object.assign(obj[key], { [i]: res });
                }
            });
        }
        return;
    }

    if (typeof dataObject[key] !== 'object' || !nextPath) {
        if (nextPath && nextPath.match(/\[]/)) {
            return;
        }

        const res = fn(dataObject[key], `${stackPath}${key}`);

        if (res === undefined) {
            return;
        }

        appendInObject(obj, key, res, nextPath);
        return;
    }

    if (typeof obj[key] === 'undefined') {
        Object.assign(obj, { [key]: {} });
    } else if (nextPath && obj[key] === null) {
        const res = fn(dataObject[key], `${stackPath}${key}`);
        if (res !== undefined) {
            Object.assign(obj, { [key]: res });
        }
        return;
    }
    const currentPath = `${stackPath}${key}.`;
    traverse(nextPath, fn, dataObject[key], obj[key], currentPath);
}

module.exports = traverse;
