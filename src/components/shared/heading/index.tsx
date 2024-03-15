import { styled } from "@gluestack-style/react";
import { Heading } from "@gluestack-ui/themed";

const CustomHeading = styled(Heading, {
    fontSize:14 ,
    lineHeight: "$xs"
}, {
    componentName:"CustomHeading" // pass same component name which is passed in config
  })

export default CustomHeading
