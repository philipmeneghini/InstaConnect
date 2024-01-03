import { ContentModel } from '../api/Client'
import { UserContents } from '../pages/main-page/HomePage'

export const dateCreatedDescendingUserContents = (a: UserContents, b: UserContents): number => {
    const firstItem = a.content
    const secondItem = b.content
    return dateCreatedDescendingContents(firstItem, secondItem)
}

export const dateCreatedDescendingContents = (a: ContentModel, b: ContentModel): number => {
    if (a.dateCreated && b.dateCreated)
        return 0
    else if (a.dateCreated)
        return -1
    else if (b.dateCreated)
        return 1

    return (a.dateCreated ?? new Date()) > (b.dateCreated ?? new Date()) ? -1 : (a.dateCreated === b.dateCreated ? 0 : 1)
}