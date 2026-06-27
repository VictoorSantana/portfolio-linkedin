

class Loader {
    

    async staticObj(url) {
        const text = await fetch(url).then(r => r.text());

        const positions = [];
        const uvs = [];
        const vertices = [];

        const lines = text.split('\n');

        for (const line of lines) {
            const parts = line.trim().split(/\s+/);

            if (parts[0] === 'v') {
                positions.push([
                    parseFloat(parts[1]),
                    parseFloat(parts[2]),
                    parseFloat(parts[3])
                ]);
            }

            else if (parts[0] === 'vt') {
                uvs.push([
                    parseFloat(parts[1]),
                    parseFloat(parts[2])
                ]);
            }

            else if (parts[0] === 'f') {
                for (let i = 1; i <= 3; i++) {
                    const [vIndex, uvIndex] = parts[i]
                        .split('/')
                        .map(Number);

                    vertices.push(
                        positions[vIndex - 1][0],
                        positions[vIndex - 1][1],
                        positions[vIndex - 1][2],

                        0, //Math.random(),
                        0, //Math.random(),
                        0, //Math.random(),

                        uvs[uvIndex - 1][0],
                        uvs[uvIndex - 1][1]
                    );
                }
            }
        }

        return vertices;    
    }
}