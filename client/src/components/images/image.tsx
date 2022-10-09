import { Settings } from "../../types/settings"

interface Props {
    item: Settings
}

export const Image = (props: Props): JSX.Element => {
    const { item } = props

    return (
        <img
            src={encodeURI(`http://localhost:4000${item.path.replace(/\.yaml|\.txt/, ".png")}`)}
            srcSet={encodeURI(`http://localhost:4000${item.path.replace(/\.yaml|\.txt/, ".png")}`)}
            alt={item.prompt}
            style={{
                display: "block",
                width: "100%"
            }}
            // loading="lazy"
        />
    )
}
