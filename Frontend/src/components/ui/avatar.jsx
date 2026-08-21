import { cn } from '../../pages/lib/utils';

function Avatar({ className, ...props }) {
  return (
    <div 
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)} 
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }) {
  return (
    <img 
      className={cn('aspect-square size-full object-cover', className)} 
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }) {
  return (
    <div 
      className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)} 
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };

