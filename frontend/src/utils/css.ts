type ClassNameArgObj = Record<string, boolean>;

function getClassesFromObject(obj: ClassNameArgObj): string[] {
  const res: string[] = [];

  for(const [className, bool] of Object.entries(obj)) {
    if(bool)
      res.push(className);
  }

  return res;
}

type ClassNameArg = ClassNameArgObj | string | undefined;

function getClasses(...args: ClassNameArg[]): string[] {
  const classes: string[] = [];

  for(const arg of args) {
    if(typeof(arg) === "object") {
      classes.push(...getClassesFromObject(arg));
    } else if(typeof(arg) === "string") {
      classes.push(arg);
    }
  }

  return classes;
}

type ParseCssModuleRes = (...args: ClassNameArg[]) => string;

/* IMPORTANT: If the a className doesn't exist inside "cssModule"
 * that className is added to the final result.
 * This is neccesary when a parent wants to add its own class to a child.
*/
export function parseCssModule(cssModule: Record<string, string>): ParseCssModuleRes {
  return (...args: ClassNameArg[]): string => {
    let classStr = "";

    for(const className of getClasses(...args)) {
      if(classStr.length > 0)
        classStr += " ";

      if(cssModule[className])
        classStr += cssModule[className];
      else
        classStr += className;
    }

    return classStr;
  };
}
