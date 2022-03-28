const nouns = ["tomato","car","dog","cat","pot" ];
const adjectives = ["happy","flying","furious"];
//shuffle array
function shuffle(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
shuffle(nouns);
shuffle(adjectives);

export const generateName = (seed: number) => {
    const noun = nouns[seed % nouns.length];
    const adjective = adjectives[seed % adjectives.length];
    return `${adjective} ${noun}`;
}