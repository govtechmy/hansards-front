import { ComponentProps } from "react";

export const ClosedFolderIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="84"
      height="64"
      viewBox="0 0 84 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 8V29.4603H62.747L35.7426 2.35382C34.2414 0.847002 32.202 0 30.075 0H8C3.58172 0 0 3.58172 0 8Z"
        fill="#94A3B8"
      />
      <path
        d="M31.0871 11.1746H8C3.58172 11.1746 0 14.7563 0 19.1746V56C0 60.4183 3.58172 64 8 64H76C80.4183 64 84 60.4183 84 56V12.0635C84 7.6452 80.4183 4.06348 76 4.06348H44.8165C42.6896 4.06348 40.6502 4.91048 39.149 6.4173L36.7546 8.82076C35.2535 10.3276 33.2141 11.1746 31.0871 11.1746Z"
        fill="url(#linear_gradient_close)"
      />
      <defs>
        <linearGradient
          id="linear_gradient_close"
          x1="42"
          y1="50"
          x2="42"
          y2="4"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.494792" stopColor="#D6E0EC" />
          <stop offset="1" stopColor="#F0F6FE" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const OpenFolderIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="91"
      height="64"
      viewBox="0 0 91 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 8V56C0 60.4183 3.58172 64 8 64H15L84 29.4603V18.6425C84 14.2242 80.4183 10.6425 76 10.6425H44L35.7426 2.35382C34.2414 0.847002 32.202 0 30.075 0H8C3.58172 0 0 3.58172 0 8Z"
        fill="#94A3B8"
      />
      <path
        d="M39.0871 21.1746H17.9659C12.1883 21.1746 7.23091 25.2917 6.16997 30.9711L1.32665 56.8982C0.637087 60.5896 3.46943 64 7.22462 64H77.1796C81.1094 64 84.4573 61.1458 85.0789 57.2655L90.8867 21.0126C91.4708 17.3667 88.6546 14.0635 84.9623 14.0635H52.8165C50.6896 14.0635 48.6502 14.9105 47.149 16.4173L44.7546 18.8208C43.2535 20.3276 41.2141 21.1746 39.0871 21.1746Z"
        fill="url(##linear_gradient_open)"
      />
      <defs>
        <linearGradient
          id="#linear_gradient_open"
          x1="47"
          y1="52.3358"
          x2="47"
          y2="14.0106"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.494792" stop-color="#D6E0EC" />
          <stop offset="1" stop-color="#F0F6FE" />
        </linearGradient>
      </defs>
    </svg>
  );
};


export const SidebarL = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="15"
      height="17"
      viewBox="0 0 15 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M1 0V4C1 10.6274 6.37258 16 13 16H15" stroke="#94A3B8" />
    </svg>
  );
};
