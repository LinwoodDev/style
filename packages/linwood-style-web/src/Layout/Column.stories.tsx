import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Story } from "@storybook/react";
import Column, { ColumnProps } from "./Column";

export default {
  title: "Layout/Column",
  component: Column,
} as Meta;

// Create a master template for mapping args to render the Column component
const Template: Story<ColumnProps> = (args) => <Column {...args} />;

// Reuse that template for creating different stories
export const Primary = Template.bind({});
Primary.args = { };