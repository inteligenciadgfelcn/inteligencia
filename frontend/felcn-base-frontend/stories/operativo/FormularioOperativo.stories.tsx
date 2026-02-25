import { Meta, StoryFn } from '@storybook/react';
import { FormularioOperativo } from '@/app/stories/organismos/operativo/FormularioOperativo';

export default {
    title: 'Operativo/FormularioOperativo',
    component: FormularioOperativo,
    parameters: {
        layout: 'centered',
    },
} as Meta;

const Template: StoryFn = () => <FormularioOperativo />;

export const Default = Template.bind({});
Default.args = {};
