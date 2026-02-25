import { FormularioOperativo } from '@/components/organismos/operativo/FormularioOperativo';
import { Meta, StoryFn } from '@storybook/react';

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
