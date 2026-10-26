import * as React from 'react';
import {cva,type VariantProps} from 'class-variance-authority';
import {clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
const buttonVariants=cva('button',{variants:{variant:{default:'button-default',ghost:'button-ghost',outline:'button-outline'},size:{default:'button-normal',icon:'button-icon'}},defaultVariants:{variant:'default',size:'default'}});
type Props=React.ButtonHTMLAttributes<HTMLButtonElement>&VariantProps<typeof buttonVariants>;
export const Button=React.forwardRef<HTMLButtonElement,Props>(({className,variant,size,type='button',...props},ref)=><button type={type} ref={ref} className={twMerge(clsx(buttonVariants({variant,size}),className))} {...props}/>);
Button.displayName='Button';
