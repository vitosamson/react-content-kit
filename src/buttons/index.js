import SectionButton from './SectionButton';
import MarkupButton from './MarkupButton';
import ListButton from './ListButton';
import LinkButton from './LinkButton';

export default {
  SectionButton,
  MarkupButton,
  LinkButton,
  LinkButton
}

export const BUILTIN_BUTTONS = {
  p: {
    button: SectionButton,
    icon: 'fa fa-paragraph',
    markup: 'p'
  },
  h1: {
    button: SectionButton,
    icon: 'fa fa-header',
    markup: 'h1'
  },
  h2: {
    button: SectionButton,
    icon: 'fa fa-header',
    markup: 'h2'
  },
  h3: {
    button: SectionButton,
    icon: 'fa fa-header',
    markup: 'h3'
  },
  blockquote: {
    button: SectionButton,
    icon: 'fa fa-quote-right',
    markup: 'blockquote'
  },
  
  ol: {
    button: ListButton,
    icon: 'fa fa-list-ol',
    markup: 'ol'
  },
  ul: {
    button: ListButton,
    icon: 'fa fa-list',
    markup: 'ul'
  },

  b: {
    button: MarkupButton,
    icon: 'fa fa-bold',
    markup: 'b',
    isActive() {
      return document.queryCommandState('bold');
    }
  },
  i: {
    button: MarkupButton,
    icon: 'fa fa-italic',
    markup: 'i',
    isActive() {
      return document.queryCommandState('italic');
    }
  },
  strong: {
    button: MarkupButton,
    icon: 'fa fa-bold',
    markup: 'strong',
    isActive() {
      return document.queryCommandState('bold');
    }
  },
  em: {
    button: MarkupButton,
    icon: 'fa fa-italic',
    markup: 'em',
    isActive() {
      return document.queryCommandState('italic');
    }
  },
  u: {
    button: MarkupButton,
    icon: 'fa fa-underline',
    markup: 'u',
    isActive() {
      return document.queryCommandState('underline');
    }
  },
  sub: {
    button: MarkupButton,
    icon: 'fa fa-subscript',
    markup: 'sub',
    isActive() {
      return document.queryCommandState('subscript');
    }
  },
  sup: {
    button: MarkupButton,
    icon: 'fa fa-superscript',
    markup: 'sup',
    isActive() {
      return document.queryCommandState('superscript');
    }
  },
  s: {
    button: MarkupButton,
    icon: 'fa fa-strikethrough',
    markup: 's',
    isActive() {
      return document.queryCommandState('strikethrough');
    }
  },
  del: {
    button: MarkupButton,
    icon: 'fa fa-strikethrough',
    markup: 'del',
    isActive() {
      return document.queryCommandState('strikethrough');
    }
  },

  link: {
    button: LinkButton,
    icon: 'fa fa-link'
  }
}
