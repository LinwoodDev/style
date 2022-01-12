import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Story } from "@storybook/react";
import ColumnItem, { ColumnItemProps } from './ColumnItem';

export default {
  title: "Components/Item/Column",
  component: ColumnItem,
} as Meta;

// Create a master template for mapping args to render the Button component
const Template: Story<ColumnItemProps> = (args) => <ColumnItem {...args} />;

// Reuse that template for creating different stories
export const Primary = Template.bind({});
Primary.args = { title: "Title", subtitle: "Subtitle" };