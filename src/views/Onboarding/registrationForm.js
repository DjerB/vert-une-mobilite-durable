import React from 'react';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import { REGIONS } from '../../constants/onboarding';

const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        backgroundColor: "white",
        width: "100%"
    },
    dense: {
        marginTop: theme.spacing(2),
    },
    notchedOutline: {
        borderRadius: "5px",
        borderColor: "#E5E5E5"
    },
    focused: {
        "& $notchedOutline": {
            borderColor: "#6EC8DE !important",
            color: "#6EC8DE !important"
        }
    },
    multilineColor:{
        color:'#5C747B'
    },
    label: {
        "&$focusedLabel": {
          color: "#6EC8DE !important"
        }
    },
    focusedLabel: {},
    menu: {
        width: 200,
    },
}));


const RegistrationForm = ({ name, region, firstName, gaiaId, onChange, errors }) => {
    const classes = useStyles();
    return (
    <form className="w-75">
        <TextField
            id="outlined-name"
            value={name}
            label="Ton nom"
            placeholder="Ton nom"
            className={clsx(classes.textField, classes.dense)}
            InputProps={{
                classes: {
                    notchedOutline: classes.notchedOutline,
                    focused: classes.focused,
                    input: classes.multilineColor
                }
            }}
            InputLabelProps={{
                classes: {
                    root: classes.label,
                    focused: classes.focusedLabel
                },
            }}
            onChange={onChange}
            margin="dense"
            variant="outlined"
            name="name"
            error={errors["name"]}
        />
        <TextField
            id="outlined-firstName"
            value={firstName}
            label="Ton prénom"
            placeholder="Ton prénom"
            className={clsx(classes.textField, classes.dense)}
            InputProps={{
                classes: {
                    notchedOutline: classes.notchedOutline,
                    focused: classes.focused,
                    input: classes.multilineColor
                }
            }}
            InputLabelProps={{
                classes: {
                    root: classes.label,
                    focused: classes.focusedLabel
                },
            }}
            onChange={onChange}
            margin="dense"
            variant="outlined"
            name="firstName"
            error={errors["firstName"]}
        />
        <TextField
            id="outlined-region"
            select
            value={region}
            label="Ta région"
            placeholder="Ta région"
            className={clsx(classes.textField, classes.dense)}
            InputProps={{
                classes: {
                    notchedOutline: classes.notchedOutline,
                    focused: classes.focused,
                    input: classes.multilineColor
                }
            }}
            InputLabelProps={{
                classes: {
                    root: classes.label,
                    focused: classes.focusedLabel
                },
            }}
            SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
            }}
            onChange={onChange}
            margin="dense"
            variant="outlined"
            name="region"
            error={errors["region"]}
        >
            {REGIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
        <TextField
            disabled
            id="outlined-gaiaId"
            value={gaiaId}
            label="Ton gaia id"
            placeholder="Ton gaia id"
            className={clsx(classes.textField, classes.dense)}
            InputProps={{
                classes: {
                    notchedOutline: classes.notchedOutline,
                    focused: classes.focused,
                    input: classes.multilineColor
                }
            }}
            InputLabelProps={{
                classes: {
                    root: classes.label,
                    focused: classes.focusedLabel
                },
            }}
            onChange={onChange}
            margin="dense"
            variant="outlined"
            name="gaiaId"
            error={errors["gaiaId"]}
        />
    </form>);
};

export default RegistrationForm;