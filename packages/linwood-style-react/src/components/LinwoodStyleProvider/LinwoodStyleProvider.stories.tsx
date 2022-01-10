import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Story } from "@storybook/react";
import LinwoodStyleProvider, { LinwoodStyleProviderProps } from "./LinwoodStyleProvider";

export default {
  title: "Components/Style Provider",
  component: LinwoodStyleProvider,
} as Meta;

// Create a master template for mapping args to render the Button component
const Template: Story<LinwoodStyleProviderProps> = (args) => <LinwoodStyleProvider {...args} />;

// Reuse that template for creating different stories
export const Default = Template.bind({});
Default.args = {  };