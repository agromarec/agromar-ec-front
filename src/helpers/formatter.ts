
interface NumberFormatOptions extends Intl.NumberFormatOptions {
  as?: 'currency' | 'number';
  value?: number;
}

interface DateOptions extends Intl.DateTimeFormatOptions {
  as?: 'date';
  date?: Date | number;
  language?: Intl.LocalesArgument;
}

type FormatterProps = NumberFormatOptions | DateOptions;

type FormatterControllerProps = NumberFormatOptions & DateOptions;

const FormatterController = {
  'currency': (props: NumberFormatOptions) => (new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: props.currency || 'USD',
    minimumFractionDigits: props.minimumFractionDigits || 2,
    maximumFractionDigits: props.maximumFractionDigits || 2,
  }).format(props.value || 0)),

  'number': (props: NumberFormatOptions) => (new Intl.NumberFormat('en-US', { ...props }).format(props.value || 0)),

  'date': (props: DateOptions) => (new Intl.DateTimeFormat(props.language || 'en-US', {
    dateStyle: props.dateStyle,
    timeStyle: props.timeStyle,
  }).format(props.date || new Date())),
}

export const formatter = ({ as = 'currency', ...rest }: FormatterProps) => FormatterController[as](<FormatterControllerProps>{ ...rest, as });