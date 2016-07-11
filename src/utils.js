_ = require('lodash')
// Process the raw data, grouping non-overlapping events
function groupData(data) {
    data = _.sortBy(_.cloneDeep(data), function(d) { return d.birth })
    groups = []

    while(data.length) {
        group = _.pullAt(data, 0)
        next_non_overlapping = data.length

        do {
            // Find index of next non-overlapping event
            next_non_overlapping = _.sortedIndexBy(
                data,
                {birth: group[group.length - 1].death},
                function(d) { return d.birth; }
            )

            if(next_non_overlapping != data.length) {
                group = group.concat(_.pullAt(data, next_non_overlapping))
            } else {
                break
            }
        } while(true)

        groups.push(group)
    }

    return groups
}


module.exports = {
    groupData: groupData
}
