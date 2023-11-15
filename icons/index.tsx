import { ComponentProps, FunctionComponent } from "react";

export interface IconProps {
  className?: string;
  fillColor?: string;
  transform?: string;
}

export const UpDownIcon: FunctionComponent<IconProps> = ({
  className,
  transform,
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g id="UpDownIcon">
        <path
          id="Up"
          d="M6.48939 11.0468C6.39703 11.081 6.31232 11.1331 6.24009 11.2001C6.16786 11.2671 6.10952 11.3476 6.06842 11.4371C6.02732 11.5266 6.00425 11.6234 6.00053 11.7218C5.99682 11.8202 6.01253 11.9184 6.04677 12.0108C6.08101 12.1032 6.13311 12.1879 6.20009 12.2601L9.45009 15.7601C9.5203 15.8358 9.60539 15.8962 9.70003 15.9376C9.79467 15.9789 9.89683 16.0002 10.0001 16.0002C10.1034 16.0002 10.2055 15.9789 10.3002 15.9376C10.3948 15.8962 10.4799 15.8358 10.5501 15.7601L13.8001 12.2601C13.9354 12.1142 14.0071 11.9206 13.9996 11.7218C13.9921 11.523 13.906 11.3354 13.7601 11.2001C13.6142 11.0648 13.4206 10.9931 13.2218 11.0006L6.77838 11.0005C6.77838 11.0005 6.58175 11.0125 6.48939 11.0468Z"
          fill={transform === "up" ? "currentColor" : "#94A3B8"}
        />
        <path
          id="Down"
          d="M10.3001 4.0626C10.2055 4.0213 10.1033 3.99999 10.0001 4C9.89681 3.99999 9.79466 4.0213 9.70002 4.0626C9.60538 4.10389 9.52028 4.16429 9.45007 4.24L6.20007 7.74C6.06481 7.88587 5.99303 8.0795 6.00053 8.27828C6.00804 8.47707 6.0942 8.66474 6.24007 8.8C6.38594 8.93526 6.57956 9.00703 6.77835 8.99953H13.2218C13.3202 9.00325 13.4184 8.98754 13.5108 8.9533C13.6031 8.91907 13.6878 8.86697 13.7601 8.8C13.8323 8.73303 13.8906 8.65248 13.9317 8.56297C13.9728 8.47345 13.9959 8.37671 13.9996 8.27828C14.0033 8.17985 13.9876 8.08166 13.9534 7.9893C13.9191 7.89694 13.867 7.81223 13.8001 7.74L10.5501 4.24C10.4799 4.16429 10.3948 4.10389 10.3001 4.0626Z"
          fill={transform === "down" ? "currentColor" : "#94A3B8"}
        />
      </g>
    </svg>
  );
};

export const ParlimenIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="27"
      height="28"
      viewBox="0 0 27 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.5135 25.8259C20.0433 25.8259 25.3368 20.5324 25.3368 14.0026C25.3368 7.47279 20.0433 2.17932 13.5135 2.17932C6.98366 2.17932 1.69019 7.47279 1.69019 14.0026C1.69019 20.5324 6.98366 25.8259 13.5135 25.8259Z"
        fill="#110C42"
      />
      <path
        d="M13.5135 1.55835C20.385 1.55835 25.9578 7.13115 25.9578 14.0026C25.9578 20.8741 20.385 26.4469 13.5135 26.4469C6.64201 26.4469 1.06921 20.8741 1.06921 14.0026C1.06921 7.12845 6.64201 1.55835 13.5135 1.55835ZM25.3368 14.0026C25.3368 7.47405 20.0448 2.17935 13.5135 2.17935C6.98221 2.17935 1.69021 7.47405 1.69021 14.0026C1.69021 20.5312 6.98221 25.8259 13.5135 25.8259C20.0448 25.8259 25.3368 20.5312 25.3368 14.0026Z"
        fill="#B49B1A"
      />
      <path
        d="M7.38452 23.4527L8.20532 21.9569L8.65622 22.2053L8.37002 23.3744L9.19892 22.5023L9.65252 22.7507L8.82902 24.2465L8.54822 24.0926L9.19622 22.9154L8.25122 23.9306L7.95962 23.7713L8.31062 22.4321L7.66262 23.6093L7.38452 23.4527Z"
        fill="#B49B1A"
      />
      <path
        d="M10.7946 24.935L10.4382 24.8189L10.4193 24.4031L9.7713 24.1898L9.5148 24.5138L9.1665 24.4004L10.3329 22.9883L10.6785 23.1017L10.7946 24.935ZM10.4031 24.0953L10.3788 23.4203L9.9603 23.9495L10.4031 24.0953Z"
        fill="#B49B1A"
      />
      <path
        d="M11.151 24.9971L11.4237 23.3258L11.7639 23.3825L11.5371 24.7703L12.3822 24.908L12.3363 25.1915L11.151 24.9971Z"
        fill="#B49B1A"
      />
      <path
        d="M14.2857 25.2401L13.9104 25.2374L13.7646 24.8486L13.0815 24.8432L12.9384 25.2293L12.5739 25.2266L13.2516 23.5256L13.6161 23.5283L14.2857 25.2401ZM13.6566 24.5597L13.4271 23.9252L13.1922 24.557L13.6566 24.5597Z"
        fill="#B49B1A"
      />
      <path
        d="M14.8446 25.1564L14.7501 24.4436L13.9995 23.5472L14.3991 23.4932L14.8878 24.1088L15.1875 23.3879L15.5817 23.3339L15.093 24.4004L15.1875 25.1105L14.8446 25.1564Z"
        fill="#B49B1A"
      />
      <path
        d="M15.8949 24.4355L16.2081 24.3086C16.2594 24.4112 16.3215 24.4787 16.3971 24.5111C16.47 24.5435 16.5591 24.5462 16.659 24.5165C16.7643 24.4841 16.8399 24.4382 16.8804 24.3761C16.9209 24.314 16.9317 24.2546 16.9155 24.1952C16.9047 24.1574 16.8831 24.1277 16.8507 24.1061C16.8183 24.0845 16.7724 24.0737 16.7103 24.071C16.6671 24.0683 16.5726 24.071 16.4241 24.0791C16.2351 24.0872 16.0947 24.071 16.0029 24.0278C15.876 23.9684 15.7923 23.8739 15.7545 23.7443C15.7302 23.6606 15.7302 23.5769 15.7545 23.4905C15.7788 23.4041 15.8328 23.3285 15.9084 23.2637C15.9867 23.1989 16.0866 23.1476 16.2135 23.1098C16.4187 23.0477 16.5861 23.0477 16.7184 23.1071C16.848 23.1665 16.9398 23.2691 16.9884 23.4176L16.6617 23.531C16.6212 23.45 16.5753 23.3987 16.5159 23.3771C16.4592 23.3555 16.3836 23.3555 16.2891 23.3852C16.1919 23.4149 16.1244 23.4554 16.0812 23.5121C16.0542 23.5472 16.0461 23.5877 16.0596 23.6282C16.0704 23.666 16.0974 23.6957 16.1379 23.7119C16.1892 23.7335 16.3026 23.7416 16.4727 23.7308C16.6455 23.72 16.7751 23.7254 16.8642 23.7416C16.9533 23.7605 17.0289 23.7956 17.0937 23.855C17.1585 23.9117 17.2071 23.9927 17.2368 24.0953C17.2638 24.1898 17.2638 24.2843 17.2368 24.3815C17.2098 24.4787 17.1531 24.5624 17.0694 24.6299C16.9857 24.6974 16.8723 24.7541 16.7319 24.7946C16.524 24.8567 16.3512 24.8567 16.2135 24.7946C16.0758 24.7325 15.9705 24.611 15.8949 24.4355Z"
        fill="#B49B1A"
      />
      <path
        d="M17.7498 24.4085L17.0829 22.8371L17.3988 22.7021L18.0657 24.2735L17.7498 24.4085Z"
        fill="#B49B1A"
      />
      <path
        d="M19.8234 23.3339L19.4967 23.5202L19.1754 23.2583L18.5841 23.5958L18.6543 24.0035L18.3357 24.1844L18.0657 22.3727L18.3816 22.1918L19.8234 23.3339ZM18.9378 23.0639L18.4194 22.6319L18.5328 23.2961L18.9378 23.0639Z"
        fill="#B49B1A"
      />
      <path
        d="M7.50874 6.96922L6.37744 5.42482L6.87694 5.05762C7.06594 4.91992 7.19554 4.83622 7.26574 4.80922C7.37104 4.76872 7.48174 4.76332 7.59784 4.79842C7.71394 4.83352 7.81654 4.91182 7.90834 5.03332C7.97854 5.12782 8.01904 5.21962 8.03254 5.31142C8.04604 5.40052 8.03794 5.48422 8.01364 5.55982C7.98664 5.63542 7.95154 5.70022 7.90564 5.75152C7.84084 5.82172 7.74094 5.90812 7.59784 6.01072L7.39534 6.15922L7.82194 6.74242L7.50874 6.96922ZM6.87964 5.45992L7.20094 5.89732L7.37104 5.77312C7.49524 5.68402 7.57084 5.61382 7.60054 5.56792C7.63024 5.52202 7.64374 5.47342 7.64374 5.41942C7.64104 5.36812 7.62484 5.31952 7.58974 5.27362C7.54924 5.21692 7.49794 5.18452 7.43854 5.17102C7.37914 5.15752 7.31974 5.16562 7.26304 5.19532C7.21984 5.21692 7.14424 5.26822 7.03084 5.34922L6.87964 5.45992Z"
        fill="#B49B1A"
      />
      <path
        d="M10.2844 5.31145L9.90636 5.49775L9.56346 5.18185L8.87766 5.52205L8.92896 5.98105L8.56176 6.16195L8.38086 4.11535L8.74806 3.93445L10.2844 5.31145ZM9.30966 4.94695L8.75886 4.42585L8.84256 5.17645L9.30966 4.94695Z"
        fill="#B49B1A"
      />
      <path
        d="M10.4139 5.28171L9.92792 3.42951L10.7136 3.22161C10.9107 3.17031 11.0592 3.14871 11.1591 3.15681C11.2563 3.16761 11.3454 3.20811 11.421 3.27831C11.4966 3.34851 11.5506 3.44031 11.5776 3.54831C11.6154 3.68601 11.6046 3.81291 11.5452 3.92361C11.4885 4.03431 11.3805 4.12611 11.2239 4.19091C11.3184 4.21791 11.3967 4.25031 11.4642 4.29351C11.5317 4.33671 11.6289 4.41771 11.7558 4.53921L12.0771 4.84161L11.6289 4.96041L11.2536 4.62831C11.1186 4.50951 11.0295 4.43661 10.9836 4.40691C10.9377 4.37991 10.8945 4.36371 10.8513 4.35831C10.8081 4.35561 10.7433 4.36371 10.6569 4.38801L10.5813 4.40691L10.7838 5.17911L10.4139 5.28171ZM10.5084 4.11531L10.7838 4.04241C10.962 3.99651 11.0727 3.95871 11.1132 3.93171C11.1537 3.90471 11.1807 3.86961 11.1969 3.82641C11.2131 3.78321 11.2131 3.73191 11.1996 3.67791C11.1834 3.61581 11.1537 3.56991 11.1105 3.54021C11.0673 3.51051 11.0133 3.49971 10.9512 3.50511C10.9188 3.50781 10.827 3.52941 10.6758 3.56991L10.3842 3.64551L10.5084 4.11531Z"
        fill="#B49B1A"
      />
      <path
        d="M12.2338 4.84965L12.0961 2.95425L12.4822 2.92725L12.5956 4.49865L13.5541 4.42845L13.5784 4.74975L12.2338 4.84965Z"
        fill="#B49B1A"
      />
      <path
        d="M13.7997 4.78489L13.8969 2.87329L14.283 2.89219L14.1858 4.80379L13.7997 4.78489Z"
        fill="#B49B1A"
      />
      <path
        d="M14.4963 4.78762L14.8851 2.91382L15.4521 3.03262L15.525 4.38262L16.1271 3.17302L16.6941 3.29182L16.3053 5.16562L15.9543 5.09272L16.2621 3.61582L15.5817 5.01442L15.2172 4.93882L15.1524 3.38632L14.8446 4.86322L14.4963 4.78762Z"
        fill="#B49B1A"
      />
      <path
        d="M16.5916 5.27903L17.3638 3.52673L18.6625 4.09913L18.5329 4.39613L17.5879 3.98033L17.4178 4.36913L18.298 4.75523L18.1684 5.04953L17.2882 4.66343L17.0776 5.14133L18.0577 5.57333L17.9281 5.86763L16.5916 5.27903Z"
        fill="#B49B1A"
      />
      <path
        d="M18.1522 5.99181L19.2484 4.42041L19.5562 4.63641L19.4671 6.13221L20.1988 5.08461L20.4931 5.28981L19.3969 6.86121L19.0783 6.63981L19.1593 5.17371L18.4465 6.19701L18.1522 5.99181Z"
        fill="#B49B1A"
      />
      <path
        d="M24.0975 19.1786L23.9814 19.643H23.2848L22.9365 20.3396H20.2608L19.7964 19.5242H18.8649L18.4599 20.0102L18.225 19.8158V19.5242H18.0684V19.8158H17.8173V19.5242H17.658V19.8158H17.4069V19.5242H17.2503V19.8158H16.9965V19.5242H16.8399V19.8158H16.5861V19.5242H16.4295V19.8158H16.1757V19.5242H16.0191V19.8158H15.768V19.5242H15.6114V19.8158H15.3603V19.5242H15.201V19.8158L14.9904 19.9211L14.7933 19.5269H10.7217V19.9913L10.6056 20.2235H3.5127L3.3372 19.9913H10.3734V19.5269H3.0456L2.9295 19.1786H24.0975ZM22.6395 19.8158V19.5242H22.4829V19.8158H22.6395ZM22.2291 19.8158V19.5242H22.0725V19.8158H22.2291ZM21.8187 19.8158V19.5242H21.6621V19.8158H21.8187ZM21.4083 19.8158V19.5242H21.2517V19.8158H21.4083ZM21.0006 19.8158V19.5242H20.844V19.8158H21.0006ZM20.5902 19.8158V19.5242H20.4336V19.8158H20.5902Z"
        fill="#B49B1A"
      />
      <path
        d="M22.4694 21.155H20.8413V21.6194H22.4694V21.155Z"
        fill="#B49B1A"
      />
      <path
        d="M20.3742 20.6906H18.2817V21.6221H20.3742V20.6906Z"
        fill="#B49B1A"
      />
      <path
        d="M18.4599 20.0129L18.2817 20.2235H15.1416L14.9904 19.9211L15.201 19.8158H15.3576H15.6087H15.7653H16.0191H16.1757H16.4295H16.5861H16.8399H16.9938H17.2476H17.4042H17.658H17.8146H18.0657H18.225L18.4599 20.0129Z"
        fill="#B49B1A"
      />
      <path
        d="M17.8173 20.6906V21.506L4.26868 21.3899L4.03648 21.0416H5.25688V20.6933H3.80428L3.62878 20.4611H10.6056V20.2289L10.7217 19.9967H11.07L11.1861 19.8806H12.933L13.3974 20.4611L15.1254 20.5529L17.8173 20.6906ZM10.7217 21.0389V20.6906H10.179V21.0389H10.7217ZM9.73348 21.0389V20.6906H9.48238V21.0389H9.73348ZM9.10708 21.0389V20.6906H8.85598V21.0389H9.10708ZM8.48068 21.0389V20.6906H8.22958V21.0389H8.48068ZM7.85428 21.0389V20.6906H7.60318V21.0389H7.85428ZM7.22518 21.0389V20.6906H6.97408V21.0389H7.22518ZM6.59878 21.0389V20.6906H6.34768V21.0389H6.59878ZM5.97238 21.0389V20.6906H5.72128V21.0389H5.97238Z"
        fill="#B49B1A"
      />
      <path
        d="M18.1359 18.9464L16.6833 15.4553L15.228 18.9464H14.7933L16.6833 14.4104L18.5733 18.9464H18.1359Z"
        fill="#B49B1A"
      />
      <path
        d="M16.6833 16.1545L16.2459 17.1994H17.118L16.6833 16.1545Z"
        fill="#B49B1A"
      />
      <path
        d="M16.4214 18.8303L16.4295 17.6072L15.6654 18.8303H16.4214Z"
        fill="#B49B1A"
      />
      <path
        d="M16.9506 18.8303L16.9452 17.6072L17.7066 18.8303H16.9506Z"
        fill="#B49B1A"
      />
      <path
        d="M19.9854 15.6983L20.1339 16.2491L19.9044 16.1816L19.7505 15.6065L19.4643 15.4931L19.629 16.1033L19.3995 16.0358L19.2294 15.4013L18.9432 15.2879L19.1214 15.9548L18.8946 15.89L18.7083 15.1961L18.4248 15.0854H18.4275L18.6219 15.809L18.3924 15.7442L18.1926 14.9936L17.7795 14.8316L17.9928 15.6281L17.766 15.5606L17.5446 14.7398L17.0019 14.5265L18.8622 18.9464H21.1896L20.2581 15.8063L19.9854 15.6983Z"
        fill="#B49B1A"
      />
      <path
        d="M14.5611 7.56048L15.1416 7.76568V7.19868L13.1652 6.50208L8.97754 7.43088V7.99788L13.1652 7.06908L14.2128 7.43898L14.2101 7.89257L13.1652 7.52268L8.97754 8.45418V9.02118L13.1652 8.08968L14.2128 8.45957L14.2101 8.91318L13.1652 8.54328L8.97754 9.47478V10.0418L13.1652 9.11298L14.2128 9.48018L14.2101 9.93377L13.1652 9.56657L8.97754 10.4954V11.0624L13.1652 10.1336L14.2128 10.5035L14.2101 10.9571L13.1652 10.5872L8.97754 11.5187V12.0857L13.1652 11.1542L14.2128 11.5241L14.2101 11.9777L13.1652 11.6078L8.97754 12.5393V13.1063L13.1652 12.1775L14.2128 12.5447L14.2101 13.001L13.1652 12.6311L8.97754 13.5599V14.1296L13.1652 13.1981L14.2128 13.568L14.2101 14.0216L13.1652 13.6517L8.97754 14.5832V15.1502L13.1652 14.2187L14.2128 14.5886L14.2101 15.0422L13.1652 14.6723L8.97754 15.6038V16.1708L13.1652 15.242L14.2101 15.6092L14.2128 16.0655L13.1652 15.6956L8.97754 16.6244V17.1941L13.1652 16.2626L14.2101 16.6325L14.2128 17.0861L13.1652 16.7162L8.97754 17.6477V18.2147L13.1652 17.2832L14.2101 17.6531L14.2128 18.1067L13.1652 17.7368L8.97754 18.6683V19.2353L13.1652 18.3065L15.1416 19.0031V18.4361L14.5611 18.2309V17.7773L15.1416 17.9825V17.4155L14.5557 17.2076L14.5611 16.754L15.1416 16.9592V16.3922L14.5611 16.187V15.7334L15.1416 15.9386V15.3716L14.5557 15.1637L14.5611 14.7128L15.1416 14.918V14.351L14.5611 14.1458V13.6895L15.1416 13.8947V13.3277L14.5557 13.1198L14.5611 12.6689L15.1416 12.8741V12.3071L14.5611 12.1019V11.6483L15.1416 11.8535V11.2838L14.5611 11.0786V10.625L15.1416 10.8302V10.2632L14.5611 10.058V9.60438L15.1416 9.80957V9.24257L14.5611 9.03738V8.58378L15.1416 8.78898V8.21927L14.5611 8.01407V7.56048Z"
        fill="#B49B1A"
      />
    </svg>
  );
};

export const MenuIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      fill="none"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <g>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16"
        />
      </g>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 12h16"
      />
      <g>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 18h16"
        />
      </g>
    </svg>
  );
};

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

export const CiteIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.83333 2.5C3.99238 2.5 2.5 3.99238 2.5 5.83333V14.1667C2.5 16.0076 3.99238 17.5 5.83333 17.5H14.1667C16.0076 17.5 17.5 16.0076 17.5 14.1667V5.83333C17.5 3.99238 16.0076 2.5 14.1667 2.5H5.83333ZM5.83333 12.5774L5.83333 14.1667C6.61725 13.8181 7.25801 13.3581 7.75562 12.7865C8.24642 12.2219 8.61111 11.6015 8.84969 10.9253C9.08828 10.2492 9.20757 9.26635 9.20757 7.97679L9.20757 5.83333H5.83333L5.83333 9.28377H7.43865C7.43865 9.76474 7.38412 10.1969 7.27505 10.5803C7.15917 10.9707 6.99216 11.3436 6.77403 11.6991C6.5559 12.0546 6.24233 12.3473 5.83333 12.5774ZM10.7924 12.5774V14.1667C11.5695 13.8181 12.2069 13.3581 12.7045 12.7865C13.2021 12.2219 13.5702 11.6015 13.8088 10.9253C14.0474 10.2492 14.1667 9.26635 14.1667 7.97679V5.83333H10.7924V9.28377H12.3977C12.3977 9.76474 12.3432 10.1969 12.2342 10.5803C12.1183 10.9707 11.9513 11.3436 11.7331 11.6991C11.515 12.0546 11.2014 12.3473 10.7924 12.5774Z"
        fill="#2563EB"
      />
    </svg>
  );
};

export const DownloadIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 2C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V16C4 16.5304 4.21071 17.0391 4.58579 17.4142C4.96086 17.7893 5.46957 18 6 18H14C14.5304 18 15.0391 17.7893 15.4142 17.4142C15.7893 17.0391 16 16.5304 16 16V7.414C15.9999 6.88361 15.7891 6.37499 15.414 6L12 2.586C11.625 2.2109 11.1164 2.00011 10.586 2H6ZM11 8C11 7.73478 10.8946 7.48043 10.7071 7.29289C10.5196 7.10536 10.2652 7 10 7C9.73478 7 9.48043 7.10536 9.29289 7.29289C9.10536 7.48043 9 7.73478 9 8V11.586L7.707 10.293C7.61475 10.1975 7.50441 10.1213 7.3824 10.0689C7.2604 10.0165 7.12918 9.9889 6.9964 9.98775C6.86362 9.9866 6.73194 10.0119 6.60905 10.0622C6.48615 10.1125 6.3745 10.1867 6.2806 10.2806C6.18671 10.3745 6.11246 10.4861 6.06218 10.609C6.0119 10.7319 5.9866 10.8636 5.98775 10.9964C5.9889 11.1292 6.01649 11.2604 6.0689 11.3824C6.12131 11.5044 6.19749 11.6148 6.293 11.707L9.293 14.707C9.48053 14.8945 9.73484 14.9998 10 14.9998C10.2652 14.9998 10.5195 14.8945 10.707 14.707L13.707 11.707C13.8892 11.5184 13.99 11.2658 13.9877 11.0036C13.9854 10.7414 13.8802 10.4906 13.6948 10.3052C13.5094 10.1198 13.2586 10.0146 12.9964 10.0123C12.7342 10.01 12.4816 10.1108 12.293 10.293L11 11.586V8Z"
        fill="#2563EB"
      />
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

export const XShare = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="300"
      height="300.251"
      viewBox="0 0 300 300.251"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66" />
    </svg>
  );
};

export const FBShare = (props: ComponentProps<"svg">) => {
  return (
    <svg
      version="1.1"
      id="svg9"
      width="666.66669"
      height="666.66718"
      viewBox="0 0 666.66668 666.66717"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs id="defs13">
        <clipPath clipPathUnits="userSpaceOnUse" id="clipPath25">
          <path d="M 0,700 H 700 V 0 H 0 Z" id="path23" />
        </clipPath>
      </defs>
      <g
        id="g17"
        transform="matrix(1.3333333,0,0,-1.3333333,-133.33333,799.99999)"
      >
        <g id="g19">
          <g id="g21" clipPath="url(#clipPath25)">
            <g id="g27" transform="translate(600,350)">
              <path
                d="m 0,0 c 0,138.071 -111.929,250 -250,250 -138.071,0 -250,-111.929 -250,-250 0,-117.245 80.715,-215.622 189.606,-242.638 v 166.242 h -51.552 V 0 h 51.552 v 32.919 c 0,85.092 38.508,124.532 122.048,124.532 15.838,0 43.167,-3.105 54.347,-6.211 V 81.986 c -5.901,0.621 -16.149,0.932 -28.882,0.932 -40.993,0 -56.832,-15.528 -56.832,-55.9 V 0 h 81.659 l -14.028,-76.396 h -67.631 V -248.169 C -95.927,-233.218 0,-127.818 0,0"
                fill="#0866ff"
                id="path29"
              />
            </g>
            <g id="g31" transform="translate(447.9175,273.6036)">
              <path
                d="M 0,0 14.029,76.396 H -67.63 v 27.019 c 0,40.372 15.838,55.899 56.831,55.899 12.733,0 22.981,-0.31 28.882,-0.931 v 69.253 c -11.18,3.106 -38.509,6.212 -54.347,6.212 -83.539,0 -122.048,-39.441 -122.048,-124.533 V 76.396 h -51.552 V 0 h 51.552 v -166.242 c 19.343,-4.798 39.568,-7.362 60.394,-7.362 10.254,0 20.358,0.632 30.288,1.831 L -67.63,0 Z"
                fill="#ffffff"
                id="path33"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
