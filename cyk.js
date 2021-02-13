class CYK {
    constructor(input) {
        this.word = input.word
        this.productions = input.productions

        // Allocate 2d array for table of size word*word
        this.table = []
        for (let i = 0; i < this.word.length; i++) {
            this.table[i] = []
            for (let j = 0; j < this.word.length; j++) {
                this.table[i][j] = null
            }
        }
    }

    get_producers(product) {
        return new Set(this.productions
            // Keep all productions which contain the searched product
            .filter(production => production.products.has(product))
            // Return producer (non-terminal)
            .map(production => production.producer))
    }

    calc(start, end) {
        // Cell is already calculated
        if (this.table[start][end]) {
            return this.table[start][end]
        }

        // Entry on the diagonal
        if (start == end) {
            this.table[start][end] = this.get_producers(this.word[start])
            return this.table[start][end]
        }

        // Calculate cell
        for (let i = start; i < end; i++) {
            // Calculate word composition
            const prefix = this.calc(start, i)
            const suffix = this.calc(i+1, end)

            if (!this.table[start][end]) {
                this.table[start][end] = new Set()
            }

            // Try each permutation of prefix and suffix
            for (let prefix_nt of prefix) {
                for (let suffix_nt of suffix) {
                    const producer = this.get_producers(prefix_nt + suffix_nt)

                    // Merge old set with new entries
                    this.table[start][end] = new Set([...this.table[start][end], ...producer])
                }
            }
        }
        return this.table[start][end]
    }

    toString() {
        this.calc(0, this.word.length-1)

        let output = "<table><tr><th></th>"
        for (let i in this.table[0]) {
            output += `<th>${Number(i)+1}</th>`
        }
        output += "</tr>"
        for (let line_index in this.table) {
            output += `<tr><td>${Number(line_index)+1}</td>`
            const line = this.table[line_index]
            for (let item_set of line) {
                let item_str = ""
                if (!item_set) {
                    // This field is not looked at
                } else if (item_set.size == 0) {
                    item_str = "-"
                } else {
                    item_str = Array.from(item_set).join()
                }
                output += `<td>${item_str}</td>`
            }
            output += "</tr>"
        }
        output += "</table>"
        return output
    }
}
